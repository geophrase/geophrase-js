import { useState } from 'react'
import { useGeophrase } from "@geophrase/react";

function App() {
  const [result, setResult] = useState(null);

  const { open } = useGeophrase({
    // 'server' (used here for a zero-config demo): SDK returns a short-lived token. Forward it to your backend to resolve.
    // 'client': SDK resolves the token and returns the full address. Requires `key`.
    mode: 'server',

    // key: 'YOUR_API_KEY', // required when mode is 'client'
    theme: 'system',        // 'light' | 'dark' | 'system'

    orderId: 'ORD-98765', // Optional
    phone: '9999999999',  // Optional. Prefill the account phone number
    onSuccess: (data) => {
      // client mode → parsed address JSON
      // server mode → { token: "..." }. POST this to your backend
      console.log("Token received:", data.token);
      setResult(data);
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

export default App
