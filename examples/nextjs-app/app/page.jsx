'use client';
import { useState } from 'react';
import { useGeophrase } from '@geophrase/react';

export default function CheckoutPage() {
    const [address, setAddress] = useState('');

    // 1. Initialize Hook
    const { open } = useGeophrase('YOUR_API_KEY_HERE');

    // 2. Trigger
    const handleCheckout = () => {
        open({
            orderId: '12345',
            onSuccess: (data) => setAddress(data.phrase)
        });
    };

    return (
        <main style={{ padding: 40 }}>
            <h2>Checkout</h2>
            <button onClick={handleCheckout}>
                Select Delivery Address
            </button>
            <p>Selected: {address}</p>
        </main>
    );
}