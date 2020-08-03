import { RaidBoss } from './raids'
import { Optional } from './utils'

const CONSUMER_KEY_KEY = 'twitter-consumer-key'
const CONSUMER_SECRET_KEY = 'twitter-secret-key'

function getKeys(keys: string[], cb: (items: { [key: string]: any }) => void) {
  chrome.storage.local.get(keys, cb)
}

const promisifiedStore = (key: string, value: any) => new Promise<void>((resolve: () => void, _) => {
  chrome.storage.local.set({ [key]: value }, resolve)
})
const promisifiedStoreAppCredentials = (consumerKey: string, consumerSecret: string) =>
  Promise.all([promisifiedStore(CONSUMER_KEY_KEY, consumerKey), promisifiedStore(CONSUMER_SECRET_KEY, consumerSecret)])

function promisifiedGet<T>(...keys: string[]) {
  return new Promise((resolve: (items: { [key: string]: T }) => void, _) => {
    getKeys(keys, resolve)
  })
}

function promisifiedRemove(key: string) {
  return new Promise((resolve: () => void, _) => {
    chrome.storage.local.remove(key, resolve)
  })
}

/**
 * Gets Twitter credentials 
 * 
 * @returns A 2 tuple of string, first element is consumer key, second is secret key
 */
const getCredentials = () => {
  return promisifiedGet<string>(CONSUMER_KEY_KEY, CONSUMER_SECRET_KEY).then((items): [string, string] => {
    return [items[CONSUMER_KEY_KEY], items[CONSUMER_SECRET_KEY]]
  })
}

/**
 * Gets chosen raid rule ID
 * @param boss raid boss
 * @return promise of a boss's associated rule ID (if it exists)
 */
function getChosenRaid(boss: RaidBoss) {
  return promisifiedGet<string | undefined>(boss.uniqueName()).then(items => {
    return items[boss.uniqueName()]
  })
}

/**
 * Store a chosen raid with its associated rule ID
 * @param boss chosen raid boss
 * @param ruleId rule ID for raid boss
 */
function storeChosenRaid(boss: RaidBoss, ruleId: string) {
  return promisifiedStore(boss.uniqueName(), ruleId)
}

function clearChosenRaid(boss: RaidBoss) {
  return promisifiedRemove(boss.uniqueName())
}

export {
  promisifiedStore as store,
  promisifiedGet as get,
  getCredentials,
  promisifiedStoreAppCredentials as storeCredentials,
  getChosenRaid,
  storeChosenRaid,
  clearChosenRaid
}