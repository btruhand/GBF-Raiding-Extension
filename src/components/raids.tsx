import React, { useState, useEffect } from 'react'
import { RaidBoss } from '@/lib/raids';
import styles from '@/styles/raids.module.scss';
import { store, get } from '@/lib/storage'

function getChosenRaid(raidName: string): Promise<any> {
    return get(raidName).then(items => items[raidName])
}

function storeChosenRaid(raidName: string, chosen: boolean) {
    console.info('setting ', raidName, ' choice to ', chosen)
    return store(raidName, chosen)
}

function RaidDisplay(props: { boss: RaidBoss }) {
    const [chosen, setChosen] = useState(false)
    const uniqueName = props.boss.uniqueName();

    useEffect(() => {
        getChosenRaid(uniqueName).then(choice => setChosen(choice));
    }, [])

    const computedOnClass = chosen ? styles['raid-chosen'] : ''
    return (
        <div key={uniqueName} className={`${styles['raid-info']} ${computedOnClass}`}
            onClick={async () => {
                await storeChosenRaid(uniqueName, !chosen) // store choice
                setChosen(!chosen) // toggle for class computation
            }}>
            <p>{props.boss.englishName()}</p>
            <p>{props.boss.japaneseName()}</p>
        </div>
    )
}

function RaidsList(props: { difficulty: string, data: RaidBoss[] }) {
    return (
        <div>
            <p>{props.difficulty}</p>
            <div className={styles['list-raids']}>
                {props.data.map(boss => <RaidDisplay boss={boss} />)}
            </div>
        </div>
    )
}

export default RaidsList