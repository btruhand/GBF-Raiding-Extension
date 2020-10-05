import { RaidBoss } from '@/lib/raids'
import { clearChosenRaid, isBossStored, storeChosenRaid } from '@/lib/storage'
import styles from '@/styles/raids.module.scss'
import React, { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'
import { TwitterLabs } from 'twitter-lite'

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
                const func = !chosen ? storeChosenRaid : clearChosenRaid
                await func(props.boss)
                setChosen(!chosen)
            }}>
            <p>{props.boss.englishName()}</p>
            <p>{props.boss.japaneseName()}</p>
        </div>
    )
}

function RaidsList(props: { difficulty: string, data: RaidBoss[], className?: string }) {
    const twitterRef: MutableRefObject<TwitterLabs | null> = useRef<TwitterLabs>(null)
    return (
        <div className={props.className}>
            <p>{props.difficulty}</p>
            <div className={styles['list-raids']}>
                {props.data.map(boss => <RaidDisplay boss={boss} twitterRef={twitterRef} />)}
            </div>
        </div>
    )
}

export default RaidsList