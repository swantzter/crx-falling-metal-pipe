chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target !== 'offscreen-doc') {
    return
  }

  switch (message.type) {
    case 'play-falling-pipe-sound':
      await playSound(message.value)
      break
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`)
  }
})

// We're limiting to 50 sounds in case chrome does the same as firefox, this is
// to prevent resource exhaustion. However since chrome's offscreen thingie is
// short-lived we only create them in the array on-demand to avoid loading all
// 50 times when it starts
const sounds = {
  metal: {
    audios: new Array(50).fill(undefined),
    filename: 'metal-pipe.ogg',
    idx: 0
  },
  glass: {
    audios: new Array(50).fill(undefined),
    filename: 'glass-pipe.ogg',
    idx: 0
  }
}

async function playSound (type) {
  if (!(type in sounds)) {
    console.warn(`Attempted to play unknown sound: ${type}`)
  }
  const { audios, filename, idx } = sounds[type]

  if (audios[idx] == null) audios[idx] = new Audio(chrome.runtime.getURL(filename))

  const pipe = audios[idx]
  sounds[type].idx = idx === audios.length - 1 ? 0 : idx + 1
  if (!pipe.paused) {
    pipe.pause()
    pipe.fastSeek(0)
  }
  await pipe.play()
}
