import React from 'react'
import { RaidBoss } from '@/lib/raids';
import styles from '@/styles/raids.module.scss';

function RaidsList(props: { difficulty: string, data: RaidBoss[] }) {
    return (
        <div>
            <p>{props.difficulty}</p>
            <div className={styles['list-raids']}>
                {props.data.map(boss =>
                    <div key={boss.uniqueName()} className={styles['raid-info']}>
                        <p>{boss.englishName()}</p>
                        <p>{boss.japaneseName()}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RaidsList