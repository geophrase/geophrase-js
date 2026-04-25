# @geophrase/react

The official React and Next.js hook for Geophrase Connect. Drop the Geophrase address selector into any React checkout in minutes and capture perfectly structured Indian addresses and coordinates to reduce Return to Origin (RTO) costs.

👉 **[Full documentation and integration guide](https://geophrase.com/docs)**

---

## Install

```bash
npm install @geophrase/react
```

`@geophrase/core` is installed automatically as a dependency. `react >= 16.8` is a peer dependency.

## Quick Start

The snippet below uses `mode: 'server'` so you can drop it into any React app and see the widget without creating an API key first.

```jsx
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function Checkout() {
    const [result, setResult] = useState(null);

    const { open } = useGeophrase({
        mode: 'server',             // widget returns a token your backend exchanges for the address
        theme: 'system',            // 'light' | 'dark' | 'system'
        orderId: 'ORD-98765',       // your internal reference id
        phone: '9999999999',        // pre-fill the customer phone

        onSuccess: (data)  => setResult(data),
        onError:   (error) => console.error('Error:', error.message),
        onClose:   ()      => console.log('User dismissed the widget.')
    });

    return (
        <div>
            <button onClick={open}>Select Delivery Address</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}
```

## Server vs Client Mode

The SDK supports two modes. Pick whichever fits your architecture:

- **`server`**: the widget returns `{ token }`. Your backend exchanges it for the full address using your API key, which never touches the frontend.
- **`client`**: the widget resolves the address in the browser and passes it straight to `onSuccess`. Requires `key` in the SDK options.

> Both modes require a Geophrase API key. See [creating and securing an API key](https://geophrase.com/docs/api-keys).
>
> If your app has a backend, `server` mode keeps your API key entirely off the frontend, which is the most secure option. If you don't have a backend (or want the fastest possible integration), `client` mode with a domain-restricted key is fine.

```jsx
// client mode, no backend integration required
const { open } = useGeophrase({
    mode: 'client',
    key: 'YOUR_API_KEY',
    onSuccess: (address) => setResult(address)
});
```

## Configuration Options

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `string` | Optional | `'client'` (default) or `'server'`. Determines the architectural flow of the SDK. |
| `key` | `string` | **Conditional** | Your [Geophrase API key](https://geophrase.com/docs/api-keys). **Required if `mode` is `'client'`.** Omit if using server mode. |
| `theme` | `string` | Optional | `'light'`, `'dark'`, or `'system'`. Defaults to `'system'`. |
| `orderId` | `string` | Optional | Your internal reference ID for this checkout session. |
| `phone` | `string` | Optional | The customer's 10-digit phone number (pre-fills the widget). |
| `onSuccess` | `function` | **Yes** | Called upon completion. Returns an `Address` object (`mode: 'client'`) or a `Token` object (`mode: 'server'`). |
| `onError` | `function` | Optional | Called if the API fails or a network error occurs. Returns an `Error` object. |
| `onClose` | `function` | Optional | Called when the user closes the modal without completing the flow. |

### Next.js (App Router)

The component calling `useGeophrase` relies on browser APIs, so it must be a **Client Component**. Add `"use client";` at the top of the file.

### TypeScript

The hook is fully typed. Import `GeophraseAddress` and `GeophraseToken` from `@geophrase/core` to type `onSuccess` results:

```tsx
import { GeophraseAddress, GeophraseToken } from '@geophrase/core';

const [result, setResult] = useState<GeophraseAddress | GeophraseToken | null>(null);
```

## What the hook returns

| Value | Description |
| :--- | :--- |
| `open()` | Opens the modal. Safe to wire directly to a button's `onClick`. |
| `close()` | Closes the modal without firing `onSuccess`. |

The underlying `Geophrase` instance is created on mount and destroyed on unmount automatically, so you do not need to call `destroy()` manually.

See the [full docs](https://geophrase.com/docs) for the complete configuration reference, security guidance, and response schemas.
