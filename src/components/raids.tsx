import React, { useState, useEffect, useReducer, useRef, RefObject, MutableRefObject } from 'react'
import { RaidBoss } from '@/lib/raids';
import styles from '@/styles/raids.module.scss';
import { store, get, getCredentials } from '@/lib/storage'
import { appTwitterInstance } from '@/lib/twitter'
import Twitter, { TwitterLabs } from 'twitter-lite';

function getChosenRaid(raidName: string): Promise<any> {
    return get(raidName).then(items => items[raidName])
}

function storeChosenRaid(raidName: string, chosen: boolean) {
    console.info('setting ', raidName, ' choice to ', chosen)
    return store(raidName, chosen)
}

function RaidDisplay(props: { boss: RaidBoss, twitterRef: RefObject<TwitterLabs | null> }) {
    const [chosen, setChosen] = useState(false)
    const uniqueName = props.boss.uniqueName();

    useEffect(() => {
        getChosenRaid(uniqueName).then(choice => setChosen(choice));
    }, [])

    const computedOnClass = chosen ? styles['raid-chosen'] : ''
    return (
        <div key={uniqueName} className={`${styles['raid-info']} ${computedOnClass}`}
            onClick={async () => {
                if (!props.twitterRef.current) { console.log('still empty ref'); return; }
                await storeChosenRaid(uniqueName, !chosen) // store choice
                setChosen(!chosen) // toggle for class computation
            }}>
            <p>{props.boss.englishName()}</p>
            <p>{props.boss.japaneseName()}</p>
        </div>
    )
}

function RaidsList(props: { difficulty: string, data: RaidBoss[] }) {
    const twitterRef: MutableRefObject<TwitterLabs | null> = useRef<TwitterLabs>(null)
    const interval = setInterval(async () => {
        const [consumerKey, secretKey] = await getCredentials()
        if (!consumerKey || !secretKey) {
            // credentials not available in storage
            return;
        }
        console.info('Twitter API credentials found, will attempt to authorize')
        const [app, _] = await appTwitterInstance(consumerKey, secretKey)
        twitterRef.current = app.withLabs()
        clearInterval(interval);
    }, 500);

    return (
        <div>
            <p>{props.difficulty}</p>
            <div className={styles['list-raids']}>
                {props.data.map(boss => <RaidDisplay boss={boss} twitterRef={twitterRef} />)}
            </div>
        </div>
    )
}

export default RaidsList