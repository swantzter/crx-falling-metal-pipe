// Apparently, I've learned, firefox creates a separate PulseAudio connection
// for each separate audio element, which can lead to crashes.
// Therefore we just create a fixed number of them and loop through them,
// in the hopes that by the time we wrap around it'll have completed its
// previous play-through and be ready to start again
const sounds = {
  metal: {
    audios: new Array(50).fill(undefined).map(() => new Audio('metal-pipe.ogg')),
    idx: 0
  },
  glass: {
    audios: new Array(50).fill(undefined).map(() => new Audio('glass-pipe.ogg')),
    idx: 0
  }
}

async function playSound (type) {
  if (!(type in sounds)) {
    console.warn(`Attempted to play unknown sound: ${type}`)
  }

  const { audios, idx } = sounds[type]

  const pipe = audios[idx]
  sounds[type].idx = idx === audios.length - 1 ? 0 : idx + 1
  if (!pipe.paused) {
    pipe.pause()
    pipe.fastSeek(0)
  }
  await pipe.play()
}

browser.tabs.onCreated.addListener(async () => {
  await playSound('metal')
})
browser.tabs.onRemoved.addListener(async () => {
  await playSound('glass')
})
