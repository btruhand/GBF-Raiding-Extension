import React, { useState, useEffect, useReducer, useRef, RefObject, MutableRefObject, Dispatch, SetStateAction } from 'react'
import { RaidBoss } from '@/lib/raids';
import styles from '@/styles/raids.module.scss';
import { store, get, getCredentials, storeChosenRaid, getChosenRaid, clearChosenRaid } from '@/lib/storage'
import { appTwitterInstance } from '@/lib/twitter'
import Twitter, { TwitterLabs } from 'twitter-lite';
import { AssertionError } from 'assert';
import { Optional } from '@/lib/utils';

async function chooseRaidHandler(twitterLabs: TwitterLabs, boss: RaidBoss,
    setRuleId: Dispatch<SetStateAction<string>>) {
    // TODO apparently number of rules that can be added is limited, so should handle that somewhere
    // if it is made chosen then add rule
    // call Twitter API
    return twitterLabs.addRules([Twitter.labsFilterStreamRule(boss.englishSearchTerm)])
        .then(async response => {
            // @ts-ignore
            const ruleId: string = Optional.of<{ id: string }[]>(response.data).apply(d => d[0].id)
            if (!ruleId) throw new AssertionError({ message: 'rule ID unexpectedly does not exist in response' })
            console.info('successfully registered raid to Twitter rules with ID', ruleId)
            await Promise.all([storeChosenRaid(boss, ruleId), setRuleId(ruleId)])
        }).catch(e => console.error('an error occurred when adding Twitter rule for chosen raid', e))
}

async function unchooseRaidHandler(twitterLabs: TwitterLabs, boss: RaidBoss,
    ruleId: string, setRuleId: Dispatch<SetStateAction<string>>) {
    return twitterLabs.deleteRules([ruleId])
        .then(async response => {
            // @ts-ignore
            const deleted = Optional.of<{ summary: { deleted: Number } }>(response.meta).apply(d => d.summary.deleted)
            if (deleted !== 1) throw new AssertionError({ message: 'number of rules deleted is not 1!' })
            console.info('successfully removed raid from Twitter rules with ID', ruleId)
            await Promise.all([clearChosenRaid(boss), setRuleId('')])
        }).catch(e => console.error('an error occurred when trying to delete Twitter rules', e))
}

function RaidDisplay(props: { boss: RaidBoss, twitterRef: RefObject<TwitterLabs | null> }) {
    const [chosen, setChosen] = useState(false)
    const [ruleId, setRuleId] = useState('')
    const uniqueName = props.boss.uniqueName();

    useEffect(() => {
        getChosenRaid(props.boss).then(ruleId => {
            setRuleId(Optional.of(ruleId as string).orElse(''))
        })
    }, [])

    const computedOnClass = chosen ? styles['raid-chosen'] : ''
    return (
        <div key={uniqueName} className={`${styles['raid-info']} ${computedOnClass}`}
            onClick={async () => {
                const boss = props.boss
                // TODO console should be modified with modal or something
                if (!props.twitterRef.current) { console.log('still empty ref'); return; }
                const twitterLabs = props.twitterRef.current
                if (!chosen) {
                    await chooseRaidHandler(twitterLabs, boss, setRuleId)
                } else {
                    await unchooseRaidHandler(twitterLabs, boss, ruleId, setRuleId)
                }
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
    }, 2000);

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