import Twitter from 'twitter-lite'
import { ExtensionEvent } from '@/lib/events'

async function twitterRequestHandling(credentials: [string, string]) {
  console.log(`Credentials ${credentials}`)
  const twitter = new Twitter({
    consumer_key: credentials[0],
    consumer_secret: credentials[1]
  })

  const bearerToken = await twitter.getBearerToken()
  const app = new Twitter({
    consumer_key: credentials[0],
    consumer_secret: credentials[1],
    bearer_token: bearerToken.access_token
  });
  const parameters = {
    track: "#trump",
  };
  const stream = app.stream("statuses/filter", parameters)
    .on("start", response => console.log("start", response))
    .on("data", tweet => console.log("data", tweet.text))
    .on("ping", () => console.log("ping"))
    .on("error", error => console.log("error", error))
    .on("end", response => console.log("end", response));

  process.nextTick(() => stream.destroy());  // emits "end" and "error" events
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

  port.onMessage.addListener((e: ExtensionEvent) => {
    if (e.type === 'twitter') {
      console.log('got twitter event')
      twitterRequestHandling(e.payload)
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