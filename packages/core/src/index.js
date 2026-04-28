class Geophrase {
    static _instanceCounter = 0;

    constructor(options = {}) {
        if (typeof document === 'undefined') {
            this._isSSR = true;
            return;
        }

        // 1. Mode validation
        this.mode = options.mode || 'client';
        if (!['client', 'server'].includes(this.mode)) {
            throw new Error(`Geophrase: Invalid mode '${this.mode}'. Expected 'client' or 'server'.`);
        }

        // 2. API key validation
        if (this.mode === 'client' && !options.key) {
            throw new Error("Geophrase Error: 'key' is required when mode is 'client'.");
        }

        if (this.mode === 'server' && options.key) {
            console.warn("Geophrase Warning: 'key' is ignored when mode is 'server'. Ensure you are not exposing a Secret Key in your frontend.");
        }

        this.apiKey = this.mode === 'client' ? options.key : null;
        this.orderId = options.orderId;
        this.phone = options.phone;

        // 3. Theme validation
        this.theme = options.theme;
        if (this.theme && !['light', 'dark', 'system'].includes(this.theme)) {
            console.warn(`Geophrase Warning: Invalid theme '${this.theme}'. Falling back to default.`);
            this.theme = null;
        }

        this.onSuccess = options.onSuccess;
        this.onError = options.onError;
        this.onClose = options.onClose;

        // 4. Per-instance DOM IDs so multiple instances don't collide
        const instanceId = ++Geophrase._instanceCounter;
        this.iframeId = `geophrase-iframe-${instanceId}`;
        this.overlayId = `geophrase-overlay-${instanceId}`;
        this.styleId = `geophrase-styles-${instanceId}`;

        // 5. Endpoints (undocumented override for staging)
        const endpoints = options._endpoints || {};
        this.widgetOrigin = endpoints.widgetOrigin || 'https://connect.geophrase.com';
        this.apiBase = endpoints.apiBase || 'https://api.geophrase.com';

        this._boundHandleMessage = this._handleMessage.bind(this);
        this._prevBodyOverflow = null;

        // 6. Pre-compute the secure widget URL
        const url = new URL(this.widgetOrigin);
        if (this.orderId) url.searchParams.append('order-id', this.orderId);
        if (this.phone) url.searchParams.append('phone', this.phone);
        if (this.theme) url.searchParams.append('theme', this.theme);
        this.widgetUrl = url.toString();
    }

    _getIframeBgCSS() {
        const light = '#ffffff';
        const dark = '#121212';

        if (this.theme === 'light') {
            return `#${this.iframeId} { background-color: ${light}; }`;
        }
        if (this.theme === 'dark') {
            return `#${this.iframeId} { background-color: ${dark}; }`;
        }
        // 'system' or unspecified → follow OS preference, matching the widget
        return `
            #${this.iframeId} { background-color: ${light}; }
            @media (prefers-color-scheme: dark) {
                #${this.iframeId} { background-color: ${dark}; }
            }
        `;
    }

    _applyHostThemeColor() {
        const light = '#ffffff';
        const dark = '#121212';

        const ensure = (id, media, color) => {
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement('meta');
                el.id = id;
                el.name = 'theme-color';
                if (media) el.media = media;
                document.head.appendChild(el);
            }
            el.content = color;
        };

        if (this.theme === 'light') {
            ensure(`${this.styleId}-tc`, '', light);
        } else if (this.theme === 'dark') {
            ensure(`${this.styleId}-tc`, '', dark);
        } else {
            ensure(`${this.styleId}-tc-light`, '(prefers-color-scheme: light)', light);
            ensure(`${this.styleId}-tc-dark`, '(prefers-color-scheme: dark)', dark);
        }
    }

    _removeHostThemeColor() {
        [`${this.styleId}-tc`, `${this.styleId}-tc-light`, `${this.styleId}-tc-dark`]
            .forEach(id => document.getElementById(id)?.remove());
    }

    _safeCall(fn, payload) {
        if (typeof fn !== 'function') return;
        try {
            fn(payload);
        } catch (err) {
            console.error('Geophrase: merchant callback threw an error', err);
        }
    }

    _injectDOM() {
        if (document.getElementById(this.overlayId)) return;

        if (!document.getElementById(this.styleId)) {
            const style = document.createElement('style');
            style.id = this.styleId;
            style.innerHTML = `
                #${this.overlayId} {
                    position: fixed; inset: 0; width: 100dvw; height: 100dvh;
                    background-color: rgba(0, 0, 0, 0.6); z-index: 999999;
                    display: flex; justify-content: center; align-items: center;
                    opacity: 0; visibility: hidden; transition: opacity 0.3s ease;
                }
                #${this.overlayId}.geophrase-active { opacity: 1; visibility: visible; }

                #${this.iframeId} { width: 100%; height: 100%; border: none; }
                ${this._getIframeBgCSS()}

                @media (min-width: 768px) {
                    #${this.iframeId} {
                        width: 375px; height: 812px; max-height: 85vh;
                        border-radius: 20px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const overlay = document.createElement('div');
        overlay.id = this.overlayId;

        const iframe = document.createElement('iframe');
        iframe.id = this.iframeId;
        iframe.allow = 'geolocation';

        overlay.appendChild(iframe);
        document.body.appendChild(overlay);

        window.removeEventListener('message', this._boundHandleMessage);
        window.addEventListener('message', this._boundHandleMessage);
    }

    open() {
        if (this._isSSR) return;

        this._injectDOM();

        const iframe = document.getElementById(this.iframeId);
        if (iframe && !iframe.hasAttribute('src')) {
            iframe.src = this.widgetUrl;
        }

        // Preserve merchant's existing overflow; idempotent under repeated open()
        if (this._prevBodyOverflow === null) {
            this._prevBodyOverflow = document.body.style.overflow;
        }
        document.body.style.overflow = 'hidden';

        this._applyHostThemeColor();

        document.getElementById(this.overlayId)?.classList.add('geophrase-active');
    }

    close() {
        if (this._isSSR) return;

        document.body.style.overflow = this._prevBodyOverflow ?? '';
        this._prevBodyOverflow = null;

        this._removeHostThemeColor();

        document.getElementById(this.overlayId)?.classList.remove('geophrase-active');

        const iframe = document.getElementById(this.iframeId);
        if (iframe) iframe.removeAttribute('src');
    }

    destroy() {
        if (this._isSSR) return;

        document.getElementById(this.overlayId)?.remove();
        document.getElementById(this.styleId)?.remove();
        this._removeHostThemeColor();

        document.body.style.overflow = this._prevBodyOverflow ?? '';
        this._prevBodyOverflow = null;

        window.removeEventListener('message', this._boundHandleMessage);

        this.onSuccess = null;
        this.onError = null;
        this.onClose = null;
    }

    async _handleMessage(event) {
        if (event.origin !== this.widgetOrigin) return;

        // Defense in depth: only accept messages from our own iframe
        const iframe = document.getElementById(this.iframeId);
        if (!iframe || event.source !== iframe.contentWindow) return;

        let data = event.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { return; }
        }

        if (data?.type === 'GEOPHRASE_CLOSE_WIDGET') {
            this.close();
            this._safeCall(this.onClose);
            return;
        }

        if (data?.type === 'GEOPHRASE_RESOLUTION_TOKEN') {
            this.close();

            // Server mode: hand the raw token to the merchant for backend exchange
            if (this.mode === 'server') {
                this._safeCall(this.onSuccess, { token: data.token });
                return;
            }

            // Client mode: resolve the token via the public API
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(`${this.apiBase}/business/resolve/`, {
                    method: 'POST',
                    headers: {
                        'X-API-Key': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: data.token }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    this._safeCall(this.onError, {
                        type: 'API_ERROR',
                        status: response.status,
                        message: errorData.message || 'Geophrase API resolution failed'
                    });
                    return;
                }

                const responseData = await response.json();
                this._safeCall(this.onSuccess, responseData);

            } catch (error) {
                console.error('Geophrase Resolution Error:', error);
                this._safeCall(this.onError, {
                    type: 'NETWORK_ERROR',
                    message: error.name === 'AbortError'
                        ? 'Geophrase API request timed out'
                        : error.message
                });
            } finally {
                clearTimeout(timeoutId);
            }
        }
    }
}

export default Geophrase;
