# @geophrase/react

The official React and Next.js hook for Geophrase Connect. Drop the Geophrase address selector into any React checkout in minutes and capture perfectly structured Indian addresses and coordinates to reduce Return to Origin (RTO) costs.

👉 **[Full documentation and integration guide](https://business.geophrase.com/docs)**

---

## Install

```bash
npm install @geophrase/react
```

`@geophrase/core` is installed automatically as a dependency. `react >= 16.8` is a peer dependency.

## Quick Start

```jsx
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function Checkout() {
    const [result, setResult] = useState(null);

    const { open } = useGeophrase({
        mode: 'client',             // 'client' (default) or 'server'
        key: 'YOUR_API_KEY',        // required when mode is 'client'
        theme: 'system',            // 'light' | 'dark' | 'system'
        orderId: 'ORD-98765',      // your internal reference id
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

### Next.js (App Router)

The component calling `useGeophrase` relies on browser APIs, so it must be a **Client Component** — add `"use client";` at the top of the file.

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

The underlying `Geophrase` instance is created on mount and destroyed on unmount automatically — you do not need to call `destroy()` manually. See the [full docs](https://business.geophrase.com/docs) for the complete configuration reference, security guidance, and response schemas.
