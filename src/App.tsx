import React, { useRef, MutableRefObject, useState, useEffect } from 'react';
import { PortRef } from '@/types/custom'
import { getCredentials } from '@/lib/storage';
import { createEvent, ExtensionEvent } from '@/lib/events';
import { TweetedRaid } from '@/types/custom'
import styles from '@/styles/app.module.scss'

const copyRaidId = (raidId: string) => {
  return navigator.clipboard.writeText(raidId)
    .then(() => console.log('successfully copied to clipboard', raidId))
    .catch(() => console.error('unsuccessful at copying to clipboard', raidId))
}

function ListedRaid(props: { key: string, battleId: string, raidName: string }) {
  const [clicked, setClicked] = useState(false)

  const clickedStyle = clicked ? styles['raid-clicked'] : ''
  return (
    <div key={props.key} className={`${styles['display-found-raid']} ${clickedStyle}`} onClick={() => {
      copyRaidId(props.battleId).then(() => setClicked(true))
    }}>
      <p>{props.raidName}</p>
      <p>{props.battleId}</p>
    </div>
  )
}

function FoundRaids(props: { found: TweetedRaid[] }) {
  const raidList = props.found.map(r => <ListedRaid key={r[0]} battleId={r[1]} raidName={r[2]}></ListedRaid>)
  return (
    <div className="FoundRaids">
      {raidList}
    </div>
  )
}

function App() {
  const portRef: MutableRefObject<PortRef> = useRef({ port: null })
  const [foundRaids, setFoundRaids] = useState<TweetedRaid[]>([])

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
        portRef.current.port.onMessage.addListener((e: ExtensionEvent<TweetedRaid>) => {
          console.log('event received', e)
          console.log('current found raids', foundRaids)
          setFoundRaids(prevFoundRaids => [...prevFoundRaids, e.payload!])
        })
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

      <FoundRaids found={foundRaids} />
    </div>
  );
}

export default App;
