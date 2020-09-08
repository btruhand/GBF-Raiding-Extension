import React, { useState, useEffect, useRef, RefObject, MutableRefObject } from 'react'
import { RaidBoss } from '@/lib/raids';
import styles from '@/styles/raids.module.scss';
import { storeChosenRaid, getChosenRaids, clearChosenRaid, isBossStored } from '@/lib/storage'
import { TwitterLabs } from 'twitter-lite';

function RaidDisplay(props: { boss: RaidBoss, twitterRef: RefObject<TwitterLabs | null> }) {
    const [chosen, setChosen] = useState(false)
    const uniqueName = props.boss.uniqueName();

    useEffect(() => {
        isBossStored(props.boss).then(stored => setChosen(stored))
    }, [])

    const computedOnClass = chosen ? styles['raid-chosen'] : ''
    return (
        <div key={uniqueName} className={`${styles['raid-info']} ${computedOnClass}`}
            onClick={async () => {
                const boss = props.boss
                // TODO console should be modified with modal or something
                const func = !chosen ? storeChosenRaid : clearChosenRaid
                await func(boss)
                setChosen(!chosen)
            }}>
            <p>{props.boss.englishName()}</p>
            <p>{props.boss.japaneseName()}</p>
        </div>
    )
}

function RaidsList(props: { difficulty: string, data: RaidBoss[] }) {
    const twitterRef: MutableRefObject<TwitterLabs | null> = useRef<TwitterLabs>(null)
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