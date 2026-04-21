# @geophrase/core

The core vanilla JavaScript library for Geophrase Connect. Drop the Geophrase address selector into any web checkout in minutes and capture perfectly structured Indian addresses and coordinates to eliminate Return to Origin (RTO) costs.

👉 **[Full documentation and integration guide](https://business.geophrase.com/docs)**

*Building a React or Next.js app? Use [`@geophrase/react`](https://www.npmjs.com/package/@geophrase/react) instead — it wraps this core library in native hooks.*

---

## Install

The fastest path is to include the hosted script directly — no build step, no bundler:

```html
<script src="https://connect.geophrase.com/v1/geophrase.js"></script>
```

Or install from npm:

```bash
npm install @geophrase/core
```

```javascript
import Geophrase from '@geophrase/core';
```

## Quick Start

```html
<button id="geophrase-btn">Select Delivery Address</button>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const geo = new Geophrase({
            mode: 'client',             // 'client' (default) or 'server'
            key: 'YOUR_API_KEY',        // required when mode is 'client'
            theme: 'system',            // 'light' | 'dark' | 'system'
            orderId: 'ORD-98765',      // your internal reference id
            phone: '9999999999',        // pre-fill the customer phone

            onSuccess: (result) => console.log('Success:', result),
            onError:   (error)  => console.error('Error:', error.message),
            onClose:   ()       => console.log('User dismissed the widget.')
        });

        document.getElementById('geophrase-btn').onclick = () => geo.open();
    });
</script>
```

In `client` mode, `onSuccess` receives the fully resolved `GeophraseAddress`. In `server` mode, it receives `{ token }` which you exchange on your backend using your API key. See the [full docs](https://business.geophrase.com/docs) for the complete configuration reference, security guidance, and response schemas.

## API

| Method | Description |
| :--- | :--- |
| `new Geophrase(options)` | Create an instance. Pre-computes the widget URL; safe to construct at module scope. |
| `.open()` | Open the modal. Idempotent. |
| `.close()` | Close the modal without firing `onSuccess`. |
| `.destroy()` | Remove all DOM, listeners, and callbacks. Call this when your component unmounts. |

TypeScript definitions (`GeophraseOptions`, `GeophraseAddress`, `GeophraseToken`, `GeophraseError`) ship with the package.
