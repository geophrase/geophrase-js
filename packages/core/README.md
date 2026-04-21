# @geophrase/core

The core vanilla JavaScript library for Geophrase Connect. Drop the Geophrase address selector into any web checkout in minutes and capture perfectly structured Indian addresses and coordinates to reduce Return to Origin (RTO) costs.

👉 **[Full documentation and integration guide](https://business.geophrase.com/docs/vanilla-js)**

*Building a React or Next.js app? Use [`@geophrase/react`](https://www.npmjs.com/package/@geophrase/react) instead. It wraps this core library in native hooks.*

---

## Install

The fastest path is to include the hosted script directly. No build step, no bundler:

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

The snippet below uses `mode: 'server'` so you can paste it into an HTML file and see the widget without creating an API key first.

```html
<button id="geophrase-btn">Select Delivery Address</button>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const geo = new Geophrase({
            mode: 'server',             // widget returns a token your backend exchanges for the address
            theme: 'system',            // 'light' | 'dark' | 'system'
            orderId: 'ORD-98765',       // your internal reference id
            phone: '9999999999',        // pre-fill the customer phone

            onSuccess: (result) => console.log('Success:', result),
            onError:   (error)  => console.error('Error:', error.message),
            onClose:   ()       => console.log('User dismissed the widget.')
        });

        document.getElementById('geophrase-btn').onclick = () => geo.open();
    });
</script>
```

## Server vs Client Mode

The SDK supports two modes. Pick whichever fits your architecture:

- **`server`**: the widget returns `{ token }`. Your backend exchanges it for the full address using your API key, which never touches the frontend.

- **`client`**: the widget resolves the address in the browser and passes it straight to `onSuccess`. Requires `key` in the SDK options.

  > Both modes require a Geophrase API key. See [creating and securing an API key](https://business.geophrase.com/docs/api-keys).
  >
  > If your app has a backend, `server` mode keeps your API key entirely off the frontend, which is the most secure option. If you don't have a backend (or want the fastest possible integration), `client` mode with a domain-restricted key is fine.

```javascript
// client mode, no backend integration required
const geo = new Geophrase({
    mode: 'client',
    key: 'YOUR_API_KEY',
    onSuccess: (address) => console.log('Address:', address)
});
```

## Configuration Options

| Parameter   | Type       | Required        | Description                                                  |
| :---------- | :--------- | :-------------- | :----------------------------------------------------------- |
| `mode`      | `string`   | Optional        | `'client'` (default) or `'server'`. Determines the architectural flow of the SDK. |
| `key`       | `string`   | **Conditional** | Your [Geophrase API key](https://business.geophrase.com/docs/api-keys). **Required if `mode` is `'client'`.** Omit if using server mode. |
| `theme`     | `string`   | Optional        | `'light'`, `'dark'`, or `'system'`. Defaults to `'system'`.  |
| `orderId`   | `string`   | Optional        | Your internal reference ID for this checkout session.        |
| `phone`     | `string`   | Optional        | The customer's 10-digit phone number (pre-fills the widget). |
| `onSuccess` | `function` | **Yes**         | Called upon completion. Returns an `Address` object (`mode: 'client'`) or a `Token` object (`mode: 'server'`). |
| `onError`   | `function` | Optional        | Called if the API fails or a network error occurs. Returns an `Error` object. |
| `onClose`   | `function` | Optional        | Called when the user closes the modal without completing the flow. |

## API

| Method                   | Description                                                  |
| :----------------------- | :----------------------------------------------------------- |
| `new Geophrase(options)` | Create an instance. Pre-computes the widget URL; safe to construct at module scope. |
| `.open()`                | Open the modal. Idempotent.                                  |
| `.close()`               | Close the modal without firing `onSuccess`.                  |
| `.destroy()`             | Remove all DOM, listeners, and callbacks.                    |

TypeScript definitions (`GeophraseOptions`, `GeophraseAddress`, `GeophraseToken`, `GeophraseError`) ship with the package.

See the [full docs](https://business.geophrase.com/docs/vanilla-js) for the complete configuration reference, security guidance, and response schemas.