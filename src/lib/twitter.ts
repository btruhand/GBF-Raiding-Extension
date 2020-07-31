import Twitter from 'twitter-lite'

/**
 * Creates an app Twitter instance complete with bearer token
 */
export async function appTwitterInstance(consumerKey: string, secretKey: string): Promise<[Twitter, string]> {
  const client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: secretKey
  })
  const bearerToken = await client.getBearerToken()
  return [new Twitter({
    consumer_key: '',
    consumer_secret: '',
    bearer_token: bearerToken.access_token
  }), bearerToken.access_token]
}