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

// see: https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams#Consuming_a_fetch_as_a_stream
export function startStream(bearerToken: string) {
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + bearerToken);
  return fetch('https://api.twitter.com/labs/1/tweets/stream/filter',
    { method: 'GET', headers: headers })
}