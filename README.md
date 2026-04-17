# Geophrase Connect JS SDK

The official JavaScript library for Geophrase Connect. This repository contains the SDKs and UI components needed to drop the Geophrase address selector into your existing custom apps or checkout flows in minutes, capturing perfectly structured Indian addresses and coordinates to eliminate Return to Origin (RTO) costs.

📖 **[Read the full documentation and integration guide at business.geophrase.com/docs](https://business.geophrase.com/docs)**

Explore fully working demos for Vanilla JS, React, and Next.js in the `/examples` directory.

---

## ⚡ Quick Start: Vanilla JavaScript (HTML)

The fastest way to integrate Geophrase into custom web applications, headless architectures, or legacy web portals.

### 1. Include the Script
Add the Geophrase Connect script to your `<head>`. Using the `defer` attribute is highly recommended to prevent render-blocking.

```html
<script src="https://connect.geophrase.com/v1/geophrase.js" defer></script>
```

### 2. Initialize and Open
Create an instance of `Geophrase` with your API Key and optionally order details. Bind the `.open()` method to your checkout button after the DOM has loaded.

```html
<button id="geophrase-btn">Select Delivery Address</button>

<script>
    // Wait for the HTML to parse and the deferred SDK to execute
    document.addEventListener('DOMContentLoaded', function() {
        const geo = new Geophrase({
            key: 'YOUR_API_KEY',
            order_id: 'ORD-98765',  // Optional
            phone: '9999999999',    // Optional - to prefill the account phone number

            onSuccess: function(address) {
                console.log("Address confirmed:", address.phrase);
                // Proceed to routing or payment gateway
            },
            onError: function(error) {
                console.error("Geophrase encountered an error:", error.message);
            },
            onClose: function() {
                console.log("User closed the widget without selecting an address.");
            }
        });

        // Open the component when the user clicks your action button
        document.getElementById('geophrase-btn').onclick = function(e) {
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

```javascript
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function Checkout() {
    const [result, setResult] = useState(null);

    const { open } = useGeophrase({
        key: 'YOUR_API_KEY',
        order_id: 'ORD-98765', // Optional
        phone: '9999999999',   // Optional - to prefill the account phone number
        onSuccess: (address) => {
            console.log("Address confirmed:", address.phrase);
            setResult(address);
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

When storing the resolved address in React state, simply import the `GeophraseAddress` interface and pass it as a generic to `useState` to prevent type inference errors:

```tsx
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';
import { GeophraseAddress } from '@geophrase/core';

export default function Checkout() {
    // Explicitly type the state to accept the address object
    const [result, setResult] = useState<GeophraseAddress | null>(null);

    const { open } = useGeophrase({
        key: 'YOUR_API_KEY',
        onSuccess: (address) => setResult(address)
    });

    // ...
}
```

---

## 📦 Data Structures

### Example Success Response (`onSuccess`)
The SDK resolves and returns the following exact structure upon completion:

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

---

## Configuration Options

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `key` | `string` | **Yes** | Your Geophrase public API key. |
| `order_id` | `string` | Optional | Your internal reference ID for this checkout session. |
| `phone` | `string` | Optional | The customer's 10-digit phone number (pre-fills the widget). |
| `onSuccess` | `function` | **Yes** | Called when the user successfully resolves an address. Returns the `address` object. |
| `onError` | `function` | Optional | Called if the API fails or a network error occurs. Returns an `error` object. |
| `onClose` | `function` | Optional | Called when the user closes the modal without completing the flow. |

---

## 🔒 Security Note
The `key` used in the frontend configuration is your **API Key**. Because this key must be exposed in your client-side HTML or JavaScript, an unrestricted key is a security risk. You must actively protect it from unauthorized use by configuring restrictions in your Geophrase Business Dashboard.

**Security Best Practices:**
* **Web Applications:** Always secure your key immediately by whitelisting your authorized origin URLs (e.g., `https://checkout.yourdomain.com`) in the dashboard.
* **Platform Separation:** Never use a single API key across multiple platforms. If you are also deploying a mobile app, generate a separate API key and apply platform-specific restrictions (e.g., Android Package Name or iOS Bundle ID).