# Geophrase React Example

A minimal React application demonstrating how to integrate the `@geophrase/react` SDK. It runs in **server mode**, so you can get the widget working in under a minute. No API key required.

## Setup

1. Go to the example directory

   ```bash
   cd examples/react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Try the widget**
   Open the local URL Vite prints (typically `http://localhost:5173`) and click **"Select Exact Delivery Location"**. Complete the flow and you'll see the returned `{ token }` payload rendered on the page.

## Server vs Client Mode

This example uses `mode: 'server'`, where the widget returns `{ token }` and your backend exchanges it for the full address using your API key. The SDK also supports `mode: 'client'`, which resolves the address directly in the browser. That mode requires passing `key` in the options; see [creating and securing an API key](https://geophrase.com/docs/api-keys). Pick whichever fits your architecture; see the [full docs](https://geophrase.com/docs/react) for details.

## Available Scripts

- `npm run dev`: starts the development server
- `npm run build`: builds the app for production
- `npm run preview`: previews the production build locally
