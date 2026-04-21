"use client";

import { useGeophrase } from "@geophrase/react";
import { GeophraseToken } from "@geophrase/core";
import { useState } from "react";

export default function Home() {
    const [result, setResult] = useState<GeophraseToken | null>(null);

    const { open } = useGeophrase({
        // 'server' (used here for a zero-config demo): SDK returns a short-lived token. Forward it to your backend to resolve.
        // 'client': SDK resolves the token and returns the full address. Requires `key`.
        mode: 'server',

        // key: 'YOUR_API_KEY', // required when mode is 'client'
        theme: 'system',        // Optional. 'light' | 'dark' | 'system' (default)

        orderId: 'ORD-98765', // Optional
        phone: '9999999999',  // Optional. Prefill the account phone number
        onSuccess: (data) => {
            // In 'server' mode, data is a GeophraseToken. POST it to your backend to resolve
            const payload = data as GeophraseToken;
            console.log("Token received:", payload.token);
            setResult(payload);
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
