import Twitter from 'twitter-lite'
import { ExtensionEvent, createEvent } from '@/lib/events'
import { NoResponse } from '@/lib/exceptions'
import { get } from '@/lib/storage'
import raids from '@/data/raids'
import { appTwitterInstance } from './lib/twitter'

let streamReader: ReadableStreamDefaultReader<Uint8Array> | null

function twitterStreamHandler(response: Response) {
  function readIndefinite() {
    if (streamReader) {
      streamReader.read().then(function handle({ done, value }): any {
        if (done) {
          console.log('stopping')
          streamReader = null
        } else {
          console.log('value', new TextDecoder("utf-8").decode(value))
          return readIndefinite()
        }
      }).catch(reason => {
        console.error('error occured when streaming from Twitter', reason)
      })
    }
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
  const [app, bearerToken] = await appTwitterInstance(credentials[0], credentials[1])

  const appWithLabs = app.withLabs();
  appWithLabs.addRules([{ value: '#TrumpIsACompleteFailure' }]);

  // see: https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams#Consuming_a_fetch_as_a_stream
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + bearerToken);
  const response = fetch('https://api.twitter.com/labs/1/tweets/stream/filter', { method: 'GET', headers: headers })
  return response.then(twitterStreamHandler)
}

chrome.runtime.onInstalled.addListener((details) => {
  console.log(`onInstalled ID: ${details.id} | prevVersion: ${details.previousVersion} | reason: ${details.reason} ....`);
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'gbf_raiding_extension') {
    console.log('extension connected successfully')
  }

  port.onDisconnect.addListener(port => {
    console.log(`port ${port.name} is disconnecting`)
  })

  port.onMessage.addListener((e: ExtensionEvent) => {
    console.log(`background got event ${e}`)
  })

  port.onMessage.addListener(async (e: ExtensionEvent) => {
    if (e.type === 'twitter') {
      console.log('got twitter event')
      const raidNames = raids['high-level'].map(v => v.uniqueName())
      const chosenStatuses = await get(...raidNames);
      try {
        await twitterRequestHandling(e.payload)
      } catch (e) {
        port.postMessage(createEvent('twitter-unresponsive'))
      }
    }
  })

  port.onMessage.addListener((e: ExtensionEvent) => {
    if (e.type === 'twitter-stop') {
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