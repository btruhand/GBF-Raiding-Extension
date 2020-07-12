import React, { useRef, MutableRefObject } from 'react';
import { PortRef } from '@/types/custom'

function App() {
  const portRef: MutableRefObject<PortRef> = useRef({ port: null })
  const startBackground = () => {
    if (!portRef.current.port) {
      const port = chrome.runtime.connect({ name: "gbf_raiding_extension" })
      if (!port) {
        console.error('unable to connect to receiving end')
      } else {
        console.log('successfully connected to')
        port.postMessage('HEY HERE IS A MESSAGE')
        portRef.current.port = port
      }
    } else console.log("port has already been created", portRef.current.port)
  }
  const stopBackground = () => {
    if (portRef.current.port) {
      console.log(`disconnecting port ${portRef.current.port.name}`)
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
