import { Modal } from "@/components/modal";
import RaidsList from '@/components/raids';
import raids from '@/data/raids';
import { createEvent, ExtensionEvent } from '@/lib/events';
import { getCredentials } from '@/lib/storage';
import styles from '@/styles/app.module.scss';
import { BattleInfo, PortRef } from '@/types/custom';
import React, { MutableRefObject, useRef, useState } from 'react';

const copyRaidId = (raidId: string) => {
  return navigator.clipboard.writeText(raidId)
    .then(() => console.log('successfully copied to clipboard', raidId))
    .catch(() => console.error('unsuccessful at copying to clipboard', raidId))
}

function ListedRaid(props: {
  key: string,
  battleId: string,
  raidName: string,
  raidTime: string,
  battleText?: string
}) {
  const [clicked, setClicked] = useState(false)

  const clickedStyle = clicked ? styles['raid-clicked'] : ''
  let battleTextEl;
  if (props.battleText) {
    battleTextEl = <p className={styles['highlight']}>{props.battleText}</p>;
  }
  return (
    <div key={props.key} className={`${styles['display-found-raid']} ${clickedStyle}`} onClick={() => {
      copyRaidId(props.battleId).then(() => setClicked(true))
    }}>
      <div>
        <p>{props.raidName}</p>
        <p>{props.battleId}</p>
        {battleTextEl}
      </div>
      <div className={styles['right-side']}>
        <p>{props.raidTime}</p>
      </div>
    </div>
  )
}

function FoundRaids(props: { found: BattleInfo[] }) {
  const raidList = props.found.map(r =>
    <ListedRaid key={r.battleId}
      battleId={r.battleId}
      raidName={r.raidName}
      raidTime={r.raidTime}
      battleText={r.battleMessage}
    />
  )
  return (
    <div className={styles['raid-container']}>
      {raidList}
    </div>
  )
}

function App() {
  const portRef: MutableRefObject<PortRef> = useRef({ port: null })
  const [foundRaids, setFoundRaids] = useState<BattleInfo[]>([])
  const [startRaids, setStartRaids] = useState<boolean>(false);
  const listenerAddedRef = useRef<boolean>(false)

  const startBackground = async () => {
    if (!portRef.current.port) {
      const port = chrome.runtime.connect({ name: "gbf_raiding_extension" })
      if (!port) {
        console.error('unable to connect to receiving end')
        return false;
      } else {
        console.log('successfully connected to port', port)
        port.onMessage.addListener((e: ExtensionEvent<BattleInfo>) => {
          setFoundRaids(prevFoundRaids => {
            const limit = 25; // TODO make this configurable
            if (!prevFoundRaids.some(r => r.battleId === e.payload!.battleId)) {
              return [e.payload!, ...prevFoundRaids.slice(0, limit - 1)]
            }
            return prevFoundRaids;
          })
        })
        portRef.current.port = port;
        listenerAddedRef.current = true;
      }
    } else console.log("port has already been created", portRef.current.port)

    if (portRef.current.port) {
      const credentials = await getCredentials()
      console.log(`current credentials: ${credentials}`)
      if (!credentials[0] || !credentials[1]) {
        alert('no twitter credentials are stored yet, please go to settings page')
        return false;
      } else {
        console.log('posting twitter request')
        portRef.current.port.postMessage(createEvent('twitter', credentials))
      }
    } else console.log("no port currently")

    return true;
  }
  const stopBackground = async () => {
    if (portRef.current.port) {
      portRef.current.port.postMessage(createEvent('twitter-stop'))
    } else console.log("no port currently")
  }
  const startRaid = async () => {
    if (!startRaids && startBackground()) {
      setStartRaids(true);
    } else if (startRaids) {
      stopBackground();
      setStartRaids(false);
    }
  }

  const raidsRunningStyle = `${styles.start} ${startRaids ? styles.running : ''}`;
  return (
    <div className="App">
      <div className={styles['app-buttons-container']}>
        <button className={raidsRunningStyle} onClick={startRaid}></button>
        <Modal modalButtonText='&#9881;' modalTitle='Raids' buttonClassName={styles['modal-button']} closeAction={(cb) => {
          cb()
          if (portRef.current.port) {
            portRef.current.port.postMessage(createEvent('change-raid-list'))
          }
        }}>
          <RaidsList difficulty='high-level' data={raids['high-level']} />
        </Modal>
      </div>

      <FoundRaids found={foundRaids} />
    </div>
  );
}

export default App;
