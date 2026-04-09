# Geophrase JS SDK

The official JavaScript library for Geophrase Connect. This repository contains the tools needed to integrate the Geophrase address selector into any web-based checkout flow to drastically reduce Return to Origin (RTO) costs.

Explore fully working demos in the `/examples` directory.

---

## ⚡ Quick Start: Vanilla JavaScript (HTML)

The `@geophrase/core` package is the fastest way to integrate Geophrase into any website, regardless of the underlying framework (WordPress, Shopify, custom HTML, etc.).

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

### Configuration Options

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `key` | `string` | **Yes** | Your Geophrase public API key. |
| `order_id` | `string` | Optional | Your internal reference ID for this checkout session. |
| `phone` | `string` | Optional | The customer's 10-digit phone number (pre-fills the widget). |
| `onSuccess` | `function` | **Yes** | Called when the user successfully resolves an address. Returns the `address` object. |
| `onError` | `function` | Optional | Called if the API fails or a network error occurs. Returns an `error` object. |
| `onClose` | `function` | Optional | Called when the user closes the modal without completing the flow. |

---

## ⚛️ React / Next.js (Coming Soon)
*The `@geophrase/react` package is currently in development. It will provide native hooks and components for seamless integration into modern single-page applications.*

---

## Security Note
The `key` used in the frontend configuration is your **Publishable Key**. It is completely safe to expose this key in your client-side HTML or JavaScript. Never put your Secret Key in frontend code.