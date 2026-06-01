"use client";

import { useGeophrase } from "@geophrase/react";
import { GeophraseRequestId } from "@geophrase/core";
import { useState } from "react";

export default function Home() {
    const [result, setResult] = useState<GeophraseRequestId | null>(null);

    const { open } = useGeophrase({
        keyId: 'YOUR_API_KEY_ID',      // Required. Your 8-character API key id.

        // 'server' (used here for a zero-config demo): SDK returns a short-lived requestId. Forward it to your backend to resolve.
        // 'client': SDK resolves the requestId and returns the full address. Requires `key`.
        mode: 'server',

        // key: 'YOUR_API_KEY', // required when mode is 'client'
        theme: 'system',        // Optional. 'light' | 'dark' | 'system' (default)

        orderId: 'ORD-98765', // Optional
        phone: '9999999999',  // Optional. Prefill the account phone number
        onSuccess: (data) => {
            // In 'server' mode, data is a GeophraseRequestId. POST it to your backend to resolve.
            const payload = data as GeophraseRequestId;
            console.log("requestId received:", payload.requestId);
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
