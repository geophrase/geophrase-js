"use client";

import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function Page() {
    const [result, setResult] = useState(null);

    const { open } = useGeophrase({
        key: 'YOUR_API_KEY',
        order_id: 'ORD-NEXT-987', // Optional
        phone: '9999999999',      // Optional
        onSuccess: (address) => setResult(address),
        onError: (error) => console.error("Error: ", error.message),
        onClose: () => console.log("Closed")
    });

    return (
        <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h1>Next.js Checkout Demo</h1>

            <button
                onClick={open}
                style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
                Select Delivery Address
            </button>

            {result && (
                <pre style={{ marginTop: '20px', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
            )}
        </main>
    );
}