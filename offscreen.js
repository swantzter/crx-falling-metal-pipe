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

async function playSound () {
  const pipe = new Audio(chrome.runtime.getURL('metal-pipe.mp3'))
  await pipe.play()
}
