import { RaidBoss } from './raids'

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
 * Gets chosen raids
 * @param bosses array of bosses
 * @return dictionary of found bosses, with key being the boss unique name
 */
function getChosenRaids(...bosses: RaidBoss[]) {
  const keys = bosses.map(boss => boss.uniqueName())
  return promisifiedGet(...keys)
}

/**
 * Store a chosen raid with its associated rule ID
 * @param boss chosen raid boss
 */
function storeChosenRaid(boss: RaidBoss) {
  return promisifiedStore(boss.uniqueName(), true)
}

function clearChosenRaid(boss: RaidBoss) {
  return promisifiedRemove(boss.uniqueName())
}

async function isStored(key: string) {
  return Object.keys(await promisifiedGet(key)).length !== 0
}

function isBossStored(boss: RaidBoss) {
  return isStored(boss.uniqueName())
}

export {
  promisifiedStore as store,
  promisifiedGet as get,
  getCredentials,
  promisifiedStoreAppCredentials as storeCredentials,
  getChosenRaids as getChosenRaids,
  storeChosenRaid,
  clearChosenRaid,
  isStored,
  isBossStored
}