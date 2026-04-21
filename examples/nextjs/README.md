# Geophrase Next.js Example

A minimal Next.js application demonstrating how to integrate the `@geophrase/react` SDK using the App Router and TypeScript. It runs in **server mode**, so you can get the widget working in under a minute. No API key required.

## Setup

1. Go to the example directory

   ```bash
   cd examples/nextjs
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
   Open [http://localhost:3000](http://localhost:3000) and click **"Select Exact Delivery Location"**. Complete the flow and you'll see the returned `{ token }` payload rendered on the page.

## Server vs Client Mode

This example uses `mode: 'server'`, where the widget returns `{ token }` and your backend exchanges it for the full address using your API key. The SDK also supports `mode: 'client'`, which resolves the address directly in the browser. That mode requires passing `key` in the options; see [creating and securing an API key](https://business.geophrase.com/docs/api-keys). Pick whichever fits your architecture; see the [full docs](https://business.geophrase.com/docs/nextjs) for details.

## Next.js notes

- **Client Components:** `useGeophrase` uses browser APIs, so the component that calls it must be a Client Component. Add `"use client";` at the top of the file.
- **TypeScript:** The example imports `GeophraseToken` from `@geophrase/core` to type the `onSuccess` payload in server mode. Use `GeophraseAddress` instead when you switch to client mode.

## Available Scripts

- `npm run dev`: starts the development server
- `npm run build`: builds the application for production
- `npm run start`: starts a Next.js production server locally
- `npm run lint`: runs ESLint
