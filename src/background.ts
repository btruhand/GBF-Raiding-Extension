import { store, get } from '@/lib/storage'

chrome.runtime.onInstalled.addListener((details) => {
  store('appId', details.id).then(() => console.log(
    `onInstalled ID: ${details.id} | prevVersion: ${details.previousVersion} | reason: ${details.reason} ....`));
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  const result = await get('appId')
  if (sender.id === result['appId']) {
    console.log(`got message from extension ${message}`)
  }
})

chrome.browserAction.onClicked.addListener(() => {
  console.log("statement from background");
  chrome.tabs.create({ 'url': chrome.extension.getURL('index.html') }, function (tab) {
    console.log("mananaged to open tab")
    // Tab opened.
  });
})