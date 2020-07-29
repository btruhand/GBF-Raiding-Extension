import React, { useState } from 'react'
import { RaidBoss } from '@/lib/raids';
import styles from '@/styles/raids.module.scss';

function RaidDisplay(props: { boss: RaidBoss }) {
    const [on, setOn] = useState(false)
    const computedOnClass = on ? styles['raid-on'] : ''
    return <div key={props.boss.uniqueName()} className={`${styles['raid-info']} ${computedOnClass}`}
        onClick={() => setOn(!on)}>
        <p>{props.boss.englishName()}</p>
        <p>{props.boss.japaneseName()}</p>
    </div>
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