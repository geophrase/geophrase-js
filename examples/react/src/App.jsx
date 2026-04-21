import { useState } from 'react'
import {useGeophrase} from "@geophrase/react";

function App() {
  const [result, setResult] = useState(null);

  const { open } = useGeophrase({
    key: 'YOUR_API_KEY',
    orderId: 'ORD-98765', // Optional
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

export default App
