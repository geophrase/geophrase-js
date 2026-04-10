# Geophrase JS SDK

The official JavaScript library for Geophrase Connect. This repository contains the tools needed to integrate the Geophrase address selector into any web-based checkout flow to drastically reduce Return to Origin (RTO) costs.

Explore fully working demos for Vanilla JS, React, and Next.js in the `/examples` directory.

---

## ⚡ Quick Start: Vanilla JavaScript (HTML)

The fastest way to integrate Geophrase into any standard website (WordPress, Shopify, custom HTML, etc.).

### 1. Include the Script
Add the Geophrase Connect script to your `<head>` or `<body>`.

```html
<script src="[https://connect.geophrase.com/v1/geophrase.js](https://connect.geophrase.com/v1/geophrase.js)"></script>
```

### 2. Initialize and Open
Create an instance of `Geophrase` with your publishable key and order details. Bind the `.open()` method to your checkout button.

```html
<button id="geophrase-btn">Select Delivery Address</button>

<script>
    const geo = new Geophrase({
        key: 'YOUR_PUBLIC_API_KEY',
        order_id: 'ORD-98765',
        phone: '9999999999',
        
        onSuccess: function(address) {
            console.log("Address confirmed:", address.phrase);
            // Proceed to payment gateway
        },
        onError: function(error) {
            console.error("Geophrase encountered an error:", error.message);
        },
        onClose: function() {
            console.log("User closed the widget without selecting an address.");
        }
    });

    // Open the widget when the user clicks your checkout button
    document.getElementById('geophrase-btn').onclick = function(e) {
        e.preventDefault();
        geo.open();
    };
</script>
```

---

## ⚛️ React / Next.js

The `@geophrase/react` package provides native hooks for seamless integration into modern single-page applications.

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
    key: 'YOUR_PUBLIC_API_KEY',
    order_id: 'ORD-98765',
    phone: '9999999999',
    onSuccess: (address) => {
      console.log("Address confirmed:", address.phrase);
      setResult(address);
    },
    onError: (error) => console.error("Error: ", error.message),
    onClose: () => console.log("User closed the widget.")
  });

  return (
    <div>
      <button onClick={open}>Select Delivery Address</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
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

## Security Note
The `key` used in the frontend configuration is your **Publishable Key**. It is completely safe to expose this key in your client-side HTML or JavaScript. Never put your Secret Key in frontend code.