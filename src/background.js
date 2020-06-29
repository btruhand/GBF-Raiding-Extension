chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....');
});

chrome.browserAction.onClicked.addListener(() => {
  console.log("statement from background");
  chrome.tabs.create({ 'url': chrome.extension.getURL('index.html') }, function (tab) {
    console.log("mananaged to open tab")
    // Tab opened.
  });
})