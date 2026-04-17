"use client";

import {useGeophrase} from "@geophrase/react";
import { GeophraseAddress } from '@geophrase/core';
import {useState} from "react";

export default function Home() {
    const [result, setResult] = useState<GeophraseAddress | null>(null);

    const { open } = useGeophrase({
        key: 'YOUR_API_KEY',
        order_id: 'ORD-98765', // Optional
        phone: '9999999999',   // Optional - to prefill the account phone number
        onSuccess: (address) => {
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
    )
}
