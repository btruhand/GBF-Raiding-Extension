import { ExtensionEvent, createEvent } from '@/lib/events'
import { NoResponse } from '@/lib/exceptions'
import Twitter from 'twitter-lite'
import { parseTweet } from './lib/raids'
import { startStream } from '@/lib/twitter'
import { getChosenRaids } from '@/lib/storage'
import raids from '@/data/raids'
import { RaidBoss } from '@/lib/raids'

let streamReader: ReadableStreamDefaultReader<Uint8Array> | null

const highLevelRaids = raids['high-level']
let applicableBosses: RaidBoss[] = []

function twitterStreamHandler(response: Response, port: chrome.runtime.Port) {
  function readIndefinite() {
    if (streamReader) {
      streamReader.read().then(function handle({ done, value }): any {
        if (done) {
          console.log('stopping')
          streamReader = null
        } else {
          const tweet = new TextDecoder("utf-8").decode(value)
          for (const separatedTweet of tweet.split('\r\n')) {
            const parsedTweet = parseTweet(separatedTweet)
            if (parsedTweet) {
              if (applicableBosses.some(boss => boss.is(parsedTweet.raidName))) {
                // one of the applicable bossesi, so then post
                port.postMessage(createEvent('found-raid', parsedTweet))
              }
            }
          }
          return readIndefinite()
        }
      }).catch(reason => {
        console.error('error occured when streaming from Twitter', reason)
      })
    }
  }
  if (streamReader) {
    throw new Error('streaming is already running');
  }
  if (response.body) {
    streamReader = response.body.getReader();
    readIndefinite()
  } else {
    throw new NoResponse('no response from twitter stream API')
  }
}

async function twitterRequestHandling(credentials: [string, string]) {
  console.log(`Credentials ${credentials}`)
  const client = new Twitter({
    consumer_key: credentials[0],
    consumer_secret: credentials[1]
  })
  const bearerToken = await client.getBearerToken()
  return startStream(bearerToken.access_token)
}

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log(`onInstalled ID: ${details.id} | prevVersion: ${details.previousVersion} | reason: ${details.reason} ....`);
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'gbf_raiding_extension') {
    console.log('extension connected successfully')
  }

  port.onDisconnect.addListener(port => {
    console.log(`port ${port.name} is disconnecting`)
  })

  port.onMessage.addListener((e: ExtensionEvent<string>) => {
    console.log('background got event', e)
  })

  port.onMessage.addListener(async (e: ExtensionEvent<[string, string]>) => {
    if (e.type === 'twitter' && !streamReader) {
      console.log('got twitter event')
      getChosenRaids(...highLevelRaids).then(found => {
        return highLevelRaids.filter(boss => boss.uniqueName() in found)
      }).then(bosses => {
        applicableBosses = bosses
        twitterRequestHandling(e.payload!)
          .then(response => twitterStreamHandler(response, port))
          .catch(e => {
            console.error('an error occurred when handling twitter request', e)
            port.postMessage(createEvent('twitter-unresponsive'))
          })
      })
    }
  })

  port.onMessage.addListener((e: ExtensionEvent<any>) => {
    if (e.type === 'twitter-stop' && streamReader) {
      console.log('got stop twitter event')
      if (streamReader) {
        streamReader.cancel()
      }
    }
  })
})

chrome.browserAction.onClicked.addListener(() => {
  console.log("statement from background");
  chrome.tabs.create({ 'url': chrome.extension.getURL('index.html') }, function (_) {
    console.log("mananaged to open tab", _)
    // Tab opened.
  });
})