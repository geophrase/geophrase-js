class Geophrase {
    constructor(options = {}) {
        if (typeof document === 'undefined') {
            return; // SSR safe no-op
        }

        // 1. Mode Validation
        this.mode = options.mode || 'client'; // Defaults to the low-friction flow
        if (!['client', 'server'].includes(this.mode)) {
            throw new Error(`Geophrase: Invalid mode '${this.mode}'. Expected 'client' or 'server'.`);
        }

        // 2. Strict API Key Validation based on Mode
        if (this.mode === 'client' && !options.key) {
            throw new Error("Geophrase Error: 'key' is required when mode is 'client'.");
        }

        if (this.mode === 'server' && options.key) {
            console.warn("Geophrase Warning: 'key' is ignored when mode is 'server'. Ensure you are not exposing a Secret Key in your frontend.");
        }

        this.apiKey = this.mode === 'client' ? options.key : null;
        this.orderId = options.order_id;
        this.phone = options.phone;

        // 3. Theme Validation
        this.theme = options.theme;
        if (this.theme && !['light', 'dark', 'system'].includes(this.theme)) {
            console.warn(`Geophrase Warning: Invalid theme '${this.theme}'. Falling back to default.`);
            this.theme = null;
        }

        this.onSuccess = options.onSuccess;
        this.onError = options.onError;
        this.onClose = options.onClose;

        this.iframeId = 'geophrase-iframe-connect';
        this.overlayId = 'geophrase-overlay-container';
        this.styleId = 'geophrase-connect-styles';
        this.widgetOrigin = 'https://connect.geophrase.com';
        this.apiBase = 'https://api.geophrase.com';

        this._boundHandleMessage = this._handleMessage.bind(this);

        // 4. Pre-compute the secure URL (API Key is purposefully excluded)
        const url = new URL(this.widgetOrigin);
        if (this.orderId) url.searchParams.append('order-id', this.orderId);
        if (this.phone) url.searchParams.append('phone', this.phone);
        if (this.theme) url.searchParams.append('theme', this.theme);

        this.widgetUrl = url.toString();
    }

    _injectDOM() {
        if (document.getElementById(this.overlayId)) return;

        // Replace these hex codes with the exact background colors of your Next.js app
        const iframeBgColor = this.theme === 'dark' ? '#121212' : '#ffffff';

        if (!document.getElementById(this.styleId)) {
            const style = document.createElement('style');
            style.id = this.styleId;
            style.innerHTML = `
                #${this.overlayId} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background-color: rgba(0, 0, 0, 0.6); z-index: 999999;
                    display: flex; justify-content: center; align-items: center;
                    opacity: 0; visibility: hidden; transition: opacity 0.3s ease;
                }
                #${this.overlayId}.geophrase-active { opacity: 1; visibility: visible; }
                
                /* 2. Apply the pre-calculated solid background color */
                #${this.iframeId} { width: 100%; height: 100%; border: none; background-color: ${iframeBgColor}; }
                
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
        iframe.allow = "geolocation";

        overlay.appendChild(iframe);
        document.body.appendChild(overlay);

        window.removeEventListener('message', this._boundHandleMessage);
        window.addEventListener('message', this._boundHandleMessage);
    }

    open() {
        this._injectDOM();
        const iframe = document.getElementById(this.iframeId);
        if (iframe && !iframe.hasAttribute('src')) {
            iframe.src = this.widgetUrl;
        }

        document.body.style.overflow = 'hidden';
        document.getElementById(this.overlayId)?.classList.add('geophrase-active');
    }

    close() {
        document.body.style.overflow = '';
        document.getElementById(this.overlayId)?.classList.remove('geophrase-active');

        const iframe = document.getElementById(this.iframeId);
        if (iframe) iframe.removeAttribute('src');
    }

    destroy() {
        const overlay = document.getElementById(this.overlayId);
        if (overlay) overlay.remove();

        document.body.style.overflow = '';
        window.removeEventListener('message', this._boundHandleMessage);

        this.onSuccess = null;
        this.onError = null;
        this.onClose = null;
    }

    async _handleMessage(event) {
        if (event.origin !== this.widgetOrigin) return;

        let data = event.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { return; }
        }

        if (data?.type === 'GEOPHRASE_CLOSE_WIDGET') {
            this.close();
            if (this.onClose) this.onClose();
        }

        if (data?.type === 'GEOPHRASE_RESOLUTION_TOKEN') {
            this.close();

            // 5. Enterprise Flow: Return the raw token immediately
            if (this.mode === 'server') {
                if (this.onSuccess) this.onSuccess({ token: data.token });
                return;
            }

            // 6. Standard Flow: Perform client-side token resolution
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(`${this.apiBase}/business/resolve/`, {
                    method: "POST",
                    headers: {
                        "X-API-Key": this.apiKey,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token: data.token }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    if (this.onError) {
                        this.onError({
                            type: 'API_ERROR',
                            status: response.status,
                            message: errorData.message || 'Geophrase API resolution failed'
                        });
                    }
                    return;
                }

                const responseData = await response.json();
                if (this.onSuccess) this.onSuccess(responseData);

            } catch (error) {
                console.error("Geophrase Resolution Error:", error);
                if (this.onError) {
                    this.onError({
                        type: 'NETWORK_ERROR',
                        message: error.name === 'AbortError' ? 'Geophrase API request timed out' : error.message
                    });
                }
            } finally {
                clearTimeout(timeoutId);
            }
        }
    }
}

export default Geophrase;
