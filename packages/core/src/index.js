class Geophrase {
    constructor(options = {}) {
        if (!options.key || typeof document === 'undefined') {
            if (typeof document !== 'undefined') console.error("Geophrase: 'key' is required.");
            return;
        }

        this.apiKey = options.key;
        this.orderId = options.order_id;
        this.phone = options.phone;

        this.onSuccess = options.onSuccess;
        this.onError = options.onError;
        this.onClose = options.onClose;

        this.iframeId = 'geophrase-iframe-connect';
        this.overlayId = 'geophrase-overlay-container';
        this.styleId = 'geophrase-connect-styles';
        this.widgetOrigin = 'https://connect.geophrase.com';
        this.apiBase = 'https://api.geophrase.com';

        this._boundHandleMessage = this._handleMessage.bind(this);

        this._injectDOM();
    }

    _injectDOM() {
        if (document.getElementById(this.overlayId)) return;

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
                #${this.iframeId} { width: 100%; height: 100%; border: none; background-color: #fff; }
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

        const url = new URL(this.widgetOrigin);
        url.searchParams.append('api-key', this.apiKey);
        if (this.orderId) url.searchParams.append('order-id', this.orderId);
        if (this.phone) url.searchParams.append('phone', this.phone);
        iframe.src = url.toString();

        overlay.appendChild(iframe);
        document.body.appendChild(overlay);

        window.addEventListener('message', this._boundHandleMessage);
    }

    open() {
        document.body.style.overflow = 'hidden';
        document.getElementById(this.overlayId)?.classList.add('geophrase-active');
    }

    close() {
        document.body.style.overflow = '';
        document.getElementById(this.overlayId)?.classList.remove('geophrase-active');

        const iframe = document.getElementById(this.iframeId);
        if (iframe) iframe.src = iframe.src;
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

        if (event.data?.type === 'GEOPHRASE_CLOSE_WIDGET') {
            this.close();
            if (this.onClose) this.onClose();
        }

        if (event.data?.type === 'GEOPHRASE_RESOLUTION_TOKEN') {
            this.close();
            try {
                const response = await fetch(`${this.apiBase}/business/resolve/`, {
                    method: "POST",
                    headers: { "X-API-Key": this.apiKey, "Content-Type": "application/json" },
                    body: JSON.stringify({ token: event.data.token }),
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

                const data = await response.json();
                if (this.onSuccess) this.onSuccess(data);

            } catch (error) {
                console.error("Geophrase Resolution Error:", error);
                if (this.onError) {
                    this.onError({
                        type: 'NETWORK_ERROR',
                        message: error.message || 'Failed to connect to Geophrase API'
                    });
                }
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.Geophrase = Geophrase;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Geophrase;
    module.exports.default = Geophrase;
}
