# Geophrase React Example

A minimal React application demonstrating how to integrate the `@geophrase/react` SDK. It runs in **server mode**, so you only need your **API key id** — no secret API key required. Swap the placeholder `keyId` in `src/App.jsx` for your own and the widget works in under a minute.

## Setup

1. Go to the example directory

   ```bash
   cd examples/react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add your API key id**

   The widget will not load without it. Create a key in your [Geophrase dashboard](https://geophrase.com/docs/api-keys), copy its 8-character **key id**, and replace the placeholder `keyId` in `src/App.jsx`:

   ```js
   keyId: 'YOUR_API_KEY_ID', // ← replace with your key id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Try the widget**
   Open the local URL Vite prints (typically `http://localhost:5173`) and click **"Select Exact Delivery Location"**. Complete the flow and you'll see the returned `{ token }` payload rendered on the page.

## Server vs Client Mode

A `keyId` (your 8-character API key id) is **always required**, in both modes — it identifies your account to the widget and is passed to the hosted page.

This example uses `mode: 'server'`, where the widget returns `{ token }` and your backend exchanges it for the full address using your secret API key. The SDK also supports `mode: 'client'`, which resolves the address directly in the browser. That mode additionally requires passing `key` (your secret API key) in the options; see [creating and securing an API key](https://geophrase.com/docs/api-keys). Pick whichever fits your architecture; see the [full docs](https://geophrase.com/docs/react) for details.

## Available Scripts

- `npm run dev`: starts the development server
- `npm run build`: builds the app for production
- `npm run preview`: previews the production build locally
