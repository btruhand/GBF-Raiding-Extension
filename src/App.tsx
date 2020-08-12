import React, { useRef, MutableRefObject } from 'react';
import { PortRef } from '@/types/custom'
import { getCredentials } from './lib/storage';
import { createEvent, ExtensionEvent } from './lib/events';

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
  const startTwitter = async () => {
    if (portRef.current.port) {
      const credentials = await getCredentials()
      console.log(`current credentials: ${credentials}`)
      if (!credentials[0] || !credentials[1]) {
        alert('no twitter credentials are stored yet, please go to settings page')
      } else {
        console.log('posting twitter request')
        portRef.current.port.postMessage(createEvent('twitter', credentials))
        portRef.current.port.onMessage.addListener((e: ExtensionEvent<[string, string]>) =>
          console.log('event received', e))
      }
    } else console.log("no port currently")
  }
  const stopTwitter = async () => {
    if (portRef.current.port) {
      portRef.current.port.postMessage(createEvent('twitter-stop'))
    } else console.log("no port currently")
  }

  return (
    <div className="App">
      <button onClick={startBackground}>Start background</button>
      <button onClick={stopBackground}>Stop background</button>
      <button onClick={startTwitter}>Start Twitter</button>
      <button onClick={stopTwitter}>Stop Twitter</button>
    </div>
  );
}

export default App;
