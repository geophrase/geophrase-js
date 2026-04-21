"use client";

import { useGeophrase } from "@geophrase/react";
import { GeophraseAddress } from "@geophrase/core";
import { useState } from "react";

export default function Home() {
    const [result, setResult] = useState<GeophraseAddress | null>(null);

    const { open } = useGeophrase({
        mode: 'client',
        key: 'YOUR_API_KEY',
        orderId: 'ORD-98765', // Optional
        phone: '9999999999',   // Optional - pre-fill the account phone number
        onSuccess: (data) => {
            // In 'client' mode, data is the resolved GeophraseAddress
            const address = data as GeophraseAddress;
            console.log("Address confirmed:", address.phrase);
            setResult(address);
        },
        onError: (error) => console.error("Error: ", error.message),
        onClose: () => console.log("User closed the component.")
    });

    return (
        <div>
            <button onClick={open}>Select Exact Delivery Location</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}
