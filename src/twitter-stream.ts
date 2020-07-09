import Twitter from 'twitter-lite'
import { MissingCredentials } from './lib/exceptions'

function createClient(consumerKey: string, secretKey: string) {
  return new Twitter({
    consumer_key: consumerKey,
    consumer_secret: secretKey
  })
}

export { createClient }