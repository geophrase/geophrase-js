# Geophrase React Example

A minimal React application demonstrating how to integrate the `@geophrase/react` SDK. It runs in **server mode**, so you can get the widget working end-to-end in under a minute. **No API key required.**

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Try the widget**
   Open the local URL Vite prints (typically `http://localhost:5173`) and click **"Select Exact Delivery Location"**. Complete the flow and you'll see the returned `{ token }` payload rendered on the page.

## Server vs Client Mode

This example uses `mode: 'server'`, where the widget returns `{ token }` and your backend exchanges it for the full address using your API key. The SDK also supports `mode: 'client'`, which resolves the address directly in the browser. That mode requires passing `key` in the options and whitelisting your origin in the [Geophrase Business Dashboard](https://business.geophrase.com). Pick whichever fits your architecture; see the [full docs](https://business.geophrase.com/docs) for details.

## Available Scripts

- `npm run dev`: starts the development server
- `npm run build`: builds the app for production
- `npm run preview`: previews the production build locally
