import { ExtensionEvent, createEvent } from '@/lib/events'
import { NoResponse } from '@/lib/exceptions'
import Twitter from 'twitter-lite'
import { startStream, parseTweet } from '@/lib/twitter'
import { extractRaidDetailsFromTweet as extractBattleInfoFromTweet } from '@/lib/raids'
import { getChosenRaids } from '@/lib/storage'
import raids from '@/data/raids'
import { RaidBoss } from '@/lib/raids'
import { TweetedRaid } from './types/custom'
import { Optional } from './lib/utils'
import { create } from 'domain'

let streamReader: ReadableStreamDefaultReader<Uint8Array> | null

const highLevelRaids = raids['high-level']
let applicableBosses: RaidBoss[] = []

function findUserChosenRaidsFromList(bosses: RaidBoss[]): Promise<RaidBoss[]> {
  return getChosenRaids(...bosses).then(found => {
    return bosses.filter(boss => boss.uniqueName() in found)
  });
}

function twitterStreamHandler(response: Response, port: chrome.runtime.Port) {
  function postTweetToApplication(tweet: string) {
    tweet.split('\r\n')
      .map(parseTweet)
      .filter(v => !v.isEmpty())
      .map(optionalTweet => optionalTweet.apply(extractBattleInfoFromTweet))
      .filter(battleInfo => battleInfo && applicableBosses.some(boss => boss.is(battleInfo.raidName)))
      .forEach(battleInfo => {
        console.log('posting found-raid', battleInfo);
        port.postMessage(createEvent('found-raid', battleInfo))
      });
    return readIndefinite()
  }

  function readIndefinite() {
    if (streamReader) {
      streamReader.read().then(({ done, value }) => {
        if (done) {
          console.log('stopping')
          streamReader = null
        } else {
          postTweetToApplication(new TextDecoder('utf-8').decode(value))
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
      findUserChosenRaidsFromList(highLevelRaids).then(bosses => {
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

  port.onMessage.addListener((e: ExtensionEvent<any>) => {
    if (e.type === 'change-raid-list' && streamReader) {
      if (!streamReader) {
        console.log('no stream reader currently when changing raid list')
        return;
      }
      findUserChosenRaidsFromList(highLevelRaids).then(bosses => {
        applicableBosses = bosses;
      })
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