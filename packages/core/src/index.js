class GeophraseConnect {
    constructor() {
        this.apiKey = null;
        this.options = {};
        this.iframeId = 'geophrase-iframe-connect';
        this.overlayId = 'geophrase-overlay-container';
    }

    initialize(key) {
        if (!key || typeof document === 'undefined') return;
        this.apiKey = key;

        if (!document.getElementById(this.overlayId)) {
            // 1. Inject minimal CSS
            const style = document.createElement('style');
            style.innerHTML = `#${this.overlayId} { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: opacity 0.2s; } #${this.overlayId}.active { opacity: 1; visibility: visible; } #${this.iframeId} { width: 100%; height: 100%; border: none; background: #fff; max-width: 400px; max-height: 85vh; border-radius: 12px; }`;
            document.head.appendChild(style);

            // 2. Inject HTML
            const overlay = document.createElement('div');
            overlay.id = this.overlayId;
            overlay.innerHTML = `<iframe id="${this.iframeId}" allow="geolocation" src="https://connect.geophrase.com/?api-key=${this.apiKey}"></iframe>`;
            document.body.appendChild(overlay);

            // 3. Attach exact listener
            window.addEventListener('message', this._handleMessage.bind(this));
        }
    }

    open(options = {}) {
        this.options = options;
        const iframe = document.getElementById(this.iframeId);

        // Pass dynamic session data directly to the pre-loaded iframe
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'GEOPHRASE_SET_SESSION_DATA',
                orderId: options.orderId,
                phone: options.phone
            }, 'https://connect.geophrase.com');
        }

        document.getElementById(this.overlayId)?.classList.add('active');
    }

    close() {
        document.getElementById(this.overlayId)?.classList.remove('active');
    }

    async _handleMessage(event) {
        if (event.origin !== 'https://connect.geophrase.com') return;

        if (event.data?.type === 'GEOPHRASE_CLOSE_WIDGET') {
            this.close();
            if (this.options.onClose) this.options.onClose();
        }

        if (event.data?.type === 'GEOPHRASE_RESOLUTION_TOKEN') {
            this.close();
            // Resolve the token into an address payload
            const response = await fetch('https://api.geophrase.com/business/resolve/', {
                method: "POST",
                headers: { "X-API-Key": this.apiKey, "Content-Type": "application/json" },
                body: JSON.stringify({ token: event.data.token }),
            });
            if (response.ok && this.options.onSuccess) {
                this.options.onSuccess(await response.json());
            }
        }
    }
}

// Create a single instance
const Geophrase = new GeophraseConnect();

// Attach to window for standard HTML `<script>` usage
if (typeof window !== 'undefined') window.Geophrase = Geophrase;

// Export for modern bundlers (React/Next.js)
export default Geophrase;