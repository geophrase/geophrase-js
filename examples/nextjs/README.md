# Geophrase Next.js Example

This directory contains a minimal [Next.js](https://nextjs.org/) application demonstrating how to integrate the `@geophrase/react` SDK using the modern App Router and TypeScript.

## Prerequisites

Before running this example, you need a Geophrase API key.
1. Log in to your [Geophrase Business Dashboard](https://business.geophrase.com).
2. Generate a new API Key.
3. **Security Step:** Ensure you whitelist `http://localhost:3000` (the default Next.js local port) in the dashboard so the key is authorized for local testing.

## Setup Instructions

1. **Install dependencies**
   Navigate to this directory in your terminal and install the required packages:
   ```bash
   npm install
   ```

2. **Configure your API Key**
   Open your main page file (typically `app/page.tsx` or `src/app/page.tsx`) and replace the placeholder API key with your actual key:
   ```tsx
   const { open } = useGeophrase({
       key: 'YOUR_API_KEY', // <--- Add your actual key here
       orderId: 'ORD-98765',
       // ...
   });
   ```

3. **Run the development server**
   Start the local Next.js development server:
   ```bash
   npm run dev
   ```

4. **Test the integration**
   Open your browser to [http://localhost:3000](http://localhost:3000). Click the **"Select Exact Delivery Location"** button to open the widget, complete the flow, and view the structured JSON payload returned to the application.

## Key Next.js Implementation Details

* **Client Components:** Because the `@geophrase/react` SDK relies on interactive browser APIs (like window events and DOM injection), the component calling `useGeophrase` must be a Client Component. Ensure you have the `"use client";` directive at the absolute top of the file.
* **TypeScript Support:** This example utilizes the `@geophrase/core` package to import the `GeophraseAddress` interface, allowing you to strictly type the JSON payload returned by the `onSuccess` callback.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a Next.js production server locally.
- `npm run lint`: Runs ESLint to catch potential errors.