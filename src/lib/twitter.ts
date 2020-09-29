import Twitter from 'twitter-lite'
import { TweetedRaid } from '@/types/custom';
import { Optional } from './utils';

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

/**
 * Parses tweet data to get the battle ID for a raid
 * @param tweetData String tweet data
 * @example
 * <code>
 * {"data":{"id":"1293447197564915712","created_at":"2020-08-12T07:20:17.000Z","text":"F1BD53C6 :参戦ID\n参加者募集！\nLv120 グリームニル\nhttps://t.co/QtFG7Je1Zh","author_id":"1109632615202455552","attachments":{"media_keys":["3_972306581810421760"]},"entities":{"urls":[{"start":35,"end":58,"url":"https://t.co/QtFG7Je1Zh"}]},"format":"default"},"matching_rules":[{"id":"1293427133616807936"}]}
 * </code>
 * @param returns an array of tweet ID and the tweet 
 */
export function parseTweet(tweetData: string): Optional<TweetedRaid> {
  if (tweetData.length < 10) {
    // unlikely to be an actual tweet data point
    console.debug('empty tweet data', tweetData);
    return Optional.empty();
  }
  // console.log('tweet', tweetData)
  var tweetJson;
  try {
    tweetJson = JSON.parse(tweetData)
  } catch (e) {
    console.error(`an error occurred when parsing tweet: ${tweetData}`, e);
    return Optional.empty()
  }

  console.log('tweet', tweetJson)
  if (tweetJson && tweetJson.data) {
    return Optional.of({
      id: tweetJson.data.id,
      text: tweetJson.data.text,
      tweetDate: new Date(tweetJson.data.created_at)
    });
  }
  return Optional.empty();
}