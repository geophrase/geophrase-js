import { useState } from 'react'
import { useGeophrase } from "@geophrase/react";

function App() {
  const [result, setResult] = useState(null);

  const { open } = useGeophrase({
    mode: 'server',       // widget returns a token your backend exchanges for the address
    orderId: 'ORD-98765', // Optional
    phone: '9999999999',  // Optional. Prefill the account phone number
    onSuccess: (data) => {
      // In 'server' mode, data is { token: "..." }. POST it to your backend to resolve
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
