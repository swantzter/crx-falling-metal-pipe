
chrome.tabs.onCreated.addListener(async () => {
  await playSound('metal')
})
chrome.tabs.onRemoved.addListener(async () => {
  await playSound('glass')
})

async function hasOffscreenDocument (offscreenUrl) {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const matchedClients = await clients.matchAll()
  for (const client of matchedClients) {
    if (client.url === offscreenUrl) return true
  }
  return false
}

const offscreenUrl = chrome.runtime.getURL('offscreen.html')
async function createOffscreen () {
  if (!await hasOffscreenDocument(offscreenUrl)) {
    await chrome.offscreen.createDocument({
    url: offscreenUrl,
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: 'Play sound when tab is created',
  })
  }
}

async function playSound (type) {
  await createOffscreen()
  chrome.runtime.sendMessage({
    type: 'play-falling-pipe-sound',
    target: 'offscreen-doc',
    value: type
  })
}
