chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target !== 'offscreen-doc') {
    return
  }

  switch (message.type) {
    case 'play-falling-pipe-sound':
      await playSound()
      break
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`)
  }
})

// We're limiting to 50 sounds in case chrome does the same as firefox, this is
// to prevent resource exhaustion. However since chrome's offscreen thingie is
// short-lived we only create them in the array on-demand to avoid loading all
// 50 times when it starts
const sounds = new Array(50).fill(undefined)
let idx = 0

async function playSound () {
  if (sounds[idx] == null) sounds[idx] = new Audio(chrome.runtime.getURL('metal-pipe.ogg'))
  const pipe = sounds[idx]
  idx = idx === sounds.length - 1 ? 0 : idx + 1
  if (!pipe.paused) {
    pipe.pause()
    pipe.fastSeek(0)
  }
  await pipe.play()
}
