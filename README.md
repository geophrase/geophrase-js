# Geophrase Connect JS SDK

The official JavaScript library for Geophrase Connect. This repository contains the SDKs and UI components needed to drop the Geophrase address selector into your existing custom apps or checkout flows in minutes, capturing perfectly structured Indian addresses and coordinates to reduce Return to Origin (RTO) costs.

📖 **[Read the full documentation and integration guide at business.geophrase.com/docs](https://business.geophrase.com/docs)**

Explore fully working demos for Vanilla JS, React, and Next.js in the `/examples` directory.

---

## ⚡ Quick Start: Vanilla JavaScript (HTML)

The fastest way to integrate Geophrase into custom web applications, headless architectures, or legacy web portals.

### 1. Include the Script
Add the Geophrase Connect script to your `<head>`.

```html
<script src="https://connect.geophrase.com/v1/geophrase.js"></script>
```

### 2. Initialize and Open
Create an instance of `Geophrase`. Bind the `.open()` method to your checkout button after the DOM has loaded.

*The snippet below uses `mode: 'server'` so you can paste it into an HTML file and see the widget end-to-end **without creating an API key first**. The SDK also supports `mode: 'client'`, which resolves the address directly in the browser. See **Data Structures** and **Security Note** below for the full trade-off.*

```html
<button id="geophrase-btn">Select Delivery Address</button>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const geo = new Geophrase({
            // --- ARCHITECTURE FLOW ---
            // 'server': SDK returns a secure token. Omit 'key'. Pass token to your backend to resolve.
            // 'client' (default): SDK resolves and returns the full address. Requires 'key'.
            mode: 'server',

            // --- OPTIONAL SETTINGS ---
            theme: 'system',        // 'light', 'dark', or 'system'
            orderId: 'ORD-98765',   // Your internal reference ID
            phone: '9999999999',    // Prefill the account phone number

            // --- CALLBACKS ---
            onSuccess: function (result) {
                // In 'server' mode, result is { token: "..." }. POST it to your backend
                // In 'client' mode, result is the full Address object
                console.log("Success:", result);
            },
            onError: function (error) {
                console.error("Geophrase encountered an error:", error.message);
            },
            onClose: function () {
                console.log("User closed the widget without selecting an address.");
            }
        });

        document.getElementById('geophrase-btn').onclick = function (e) {
            e.preventDefault();
            geo.open();
        };
    });
</script>
```

---

## ⚛️ React / Next.js

The `@geophrase/react` package provides native hooks for a seamless integration into any React application.

### 1. Install the Package

```bash
npm install @geophrase/react
```

### 2. Use the Hook
Import the `useGeophrase` hook and attach it to your checkout button.

*(Note: If you are using the Next.js App Router, ensure the component utilizing this hook is marked with `"use client";` at the top of the file).*

The snippet below uses `mode: 'server'` so you can drop it into any React app and see the widget end-to-end **without creating an API key first**. The SDK also supports `mode: 'client'`. See **Data Structures** and **Security Note** below for the full trade-off.

```javascript
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function Checkout() {
    const [result, setResult] = useState(null);

    const { open } = useGeophrase({
        mode: 'server',
        theme: 'system',
        orderId: 'ORD-98765',
        phone: '9999999999',
        onSuccess: (data) => {
            console.log("Success:", data);
            setResult(data);
        },
        onError: (error) => console.error("Error: ", error.message),
        onClose: () => console.log("User closed the component.")
    });

    return (
        <div>
            <button onClick={open}>Select Delivery Address</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}
```

### 📘 TypeScript Support

The `@geophrase/react` and `@geophrase/core` packages ship with native TypeScript definitions.

When storing the resolved result in React state, you can type it against both the Address and Token payloads:

```tsx
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';
import { GeophraseAddress, GeophraseToken } from '@geophrase/core';

export default function Checkout() {
    // Explicitly type the state to accept either the Address or Token object
    const [result, setResult] = useState<GeophraseAddress | GeophraseToken | null>(null);

    const { open } = useGeophrase({
        mode: 'server', // switch to 'client' + key for in-browser resolution
        onSuccess: (data) => setResult(data)
    });

    // ...
}
```

---

## Configuration Options

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `string` | Optional | `'client'` (default) or `'server'`. Determines the architectural flow of the SDK. |
| `key` | `string` | **Conditional** | Your Geophrase API key. **Required if `mode` is `'client'`.** Omit if using server mode. |
| `theme` | `string` | Optional | `'light'`, `'dark'`, or `'system'`. Defaults to `'system'`. |
| `orderId` | `string` | Optional | Your internal reference ID for this checkout session. |
| `phone` | `string` | Optional | The customer's 10-digit phone number (pre-fills the widget). |
| `onSuccess` | `function` | **Yes** | Called upon completion. Returns an `Address` object (`mode: 'client'`) or a `Token` object (`mode: 'server'`). |
| `onError` | `function` | Optional | Called if the API fails or a network error occurs. Returns an `Error` object. |
| `onClose` | `function` | Optional | Called when the user closes the modal without completing the flow. |

---

## 📦 Data Structures

The shape of the data returned to your `onSuccess` callback depends entirely on the `mode` you configure.

### 1. Client Mode Payload (Default)
When `mode: 'client'`, the SDK automatically resolves the data and returns the full address object:

```json
{
  "phrase": "eid-hiu-sac",
  "verified_account_mobile_num": "9999999999",
  "address_type": "OFFICE",
  "contact_full_name": "Rohan",
  "contact_mobile_num": "9999999999",
  "address_line_one": "Floor 99",
  "address_line_two": "GTB Building",
  "landmark": "Map: gphr.in/eid-hiu-sac",
  "city": "Delhi",
  "state": "Delhi",
  "postal_code": 110007,
  "latitude": 16.241303391104953,
  "longitude": 99.7836155238037,
  "digi_pin": "202-P85-M87C",
  "qr_code": "https://storage.googleapis.com/geophrase/qr-codes/eid-hiu-sac.png"
}
```

### 2. Server Mode Payload (Token Exchange Flow)
When `mode: 'server'`, the SDK safely halts before exposing any data to the frontend and returns a single-use token:

```json
{
  "token": "gphr_tok_5f8a9b2c1d4e..."
}
```
*You must then pass this token to your backend server, where you can securely exchange it for the full address object using your Geophrase API Key.*

---

## 🔒 Security Note

**The Client-Side Flow (`mode: 'client'`):**
The `key` used in the frontend configuration is your Geophrase API Key. Because this key is exposed in your client-side HTML or JavaScript, you **must** actively protect it from unauthorized use by configuring domain restrictions (e.g., whitelisting `https://checkout.yourdomain.com`) in your Geophrase Business Dashboard. You can generate multiple API keys in your dashboard; it is highly recommended to create a dedicated, uniquely restricted key for each frontend platform or application.

**The Server-Side Flow (`mode: 'server'`):**
While we use strict domain whitelisting to protect your API keys in client mode, the absolute best practice, if your application has a backend, is to keep your API keys entirely off the frontend. By using Server Mode, you omit the `key` parameter from the SDK completely. The widget will return a secure token to your frontend, which you then safely resolve from your own server using your API key.