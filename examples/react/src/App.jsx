import React, { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function App() {
    const [result, setResult] = useState(null);

    const { open } = useGeophrase({
        key: 'YOUR_API_KEY',
        order_id: 'ORD-98765', // Optional
        phone: '9999999999',   // Optional - to prefill the account phone number
        onSuccess: (address) => setResult(address),
        onError: (error) => console.error("Error: ", error.message),
        onClose: () => console.log("Closed")
    });

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <button onClick={open}>Select Delivery Address</button>

            {result && (
                <pre style={{ marginTop: '20px', background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
            )}
        </div>
    );
}