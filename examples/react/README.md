# Geophrase React Example

This directory contains a minimal React application demonstrating how to integrate the `@geophrase/react` SDK into a modern React application.

## Prerequisites

Before running this example, you need a Geophrase API key.
1. Log in to your [Geophrase Business Dashboard](https://business.geophrase.com).
2. Generate a new API Key.
3. **Security Step:** Ensure you whitelist `http://localhost:5173` (or your specific local dev port) in the dashboard so the key is authorized for local testing.

## Setup Instructions

1. **Install dependencies**
   Navigate to this directory in your terminal and install the required packages:
   ```bash
   npm install
   ```

2. **Configure your API Key**
   Open `src/App.jsx` and replace the placeholder API key with your actual key:
   ```javascript
   const { open } = useGeophrase({
     key: 'YOUR_API_KEY_HERE', // <--- Add your key here
     // ...
   });
   ```

3. **Run the development server**
   Start the local Vite development server:
   ```bash
   npm run dev
   ```

4. **Test the integration**
   Open your browser to the local URL provided by Vite (usually `http://localhost:5173`). Click the **"Select Delivery Address"** button to open the widget, complete the flow, and view the structured JSON payload returned to the application.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.