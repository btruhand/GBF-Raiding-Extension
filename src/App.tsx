import React, { useRef, MutableRefObject } from 'react';
import { PortRef } from '@/types/custom'

function App() {
  const portRef: MutableRefObject<PortRef> = useRef({ port: null })
  const startBackground = () => {
    if (!portRef.current.port) {
      portRef.current.port = chrome.runtime.connect({ name: "gbf_raiding_extension" })
    } else console.log("port has already been created", portRef.current.port)
  }
  const stopBackground = () => {
    if (portRef.current.port) {
      portRef.current.port.disconnect()
      portRef.current = { port: null }
    } else console.log("no port currently")
  }

  return (
    <div className="App">
      <button onClick={startBackground}>Start background</button>
      <button onClick={stopBackground}>Stop background</button>
    </div>
  );
}

export default App;
