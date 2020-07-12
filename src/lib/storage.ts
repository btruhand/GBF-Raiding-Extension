const CONSUMER_KEY_KEY = 'twitter-consumer-key'
const CONSUMER_SECRET_KEY = 'twitter-secret-key'

function storeAppCredentials(consumerKey: string, consumerSecret: string, cb: () => void): void {
  chrome.storage.local.set({ [CONSUMER_KEY_KEY]: consumerKey, [CONSUMER_SECRET_KEY]: consumerSecret }, cb)
}

function getKeys(keys: string[], cb: (items: { [key: string]: any }) => void) {
  chrome.storage.local.get(keys, cb)
}

const promisifiedStore = (key: string, value: any) => new Promise((resolve: () => void, _) => {
  chrome.storage.local.set({ key: value }, resolve)
})
const promisifiedStoreAppCredentials = (consumerKey: string, consumerSecret: string) => new Promise((resolve, _) => {
  storeAppCredentials(consumerKey, consumerSecret, resolve)
})
const promisifiedGet = (...keys: string[]) => new Promise((resolve: (items: { [key: string]: any }) => void, _) => {
  getKeys(keys, resolve)
})
/**
 * Gets Twitter credentials 
 * 
 * @returns A 2 tuple of string, first element is consumer key, second is secret key
 */
const getCredentials = () => {
  return promisifiedGet(CONSUMER_KEY_KEY, CONSUMER_SECRET_KEY).then((items): [string, string] => {
    console.log(`getCredentials`, items)
    return [items[CONSUMER_KEY_KEY], items[CONSUMER_SECRET_KEY]]
  })
}

export {
  promisifiedStore as store,
  promisifiedGet as get,
  getCredentials,
  promisifiedStoreAppCredentials as storeCredentials
}