import { Replayer, unpack } from '../forks/rrweb'
import events from './response-2'

import './styles.css'
import { formatTime } from './format'

const container = document.getElementById('player')!
const frame = document.getElementById('frame')!

let isPlaying = false
let timer: number

function getTime() {
  return [
    formatTime(replayer.getCurrentTime()),
    '/',
    formatTime(replayer.getMetaData().totalTime) 
  ].join(' ')
}

function updateScale(el: HTMLDivElement, dimension: any) {

  const ratio = dimension.width / dimension.height

  const width = container.clientWidth
  const height = container.clientWidth / ratio

  const widthScale = width / dimension.width
  const heightScale = height / dimension.height
  const scale = Math.min(widthScale, heightScale)

  el.style.transform = `scale(${scale})`

  container.style.width = `${width}px`
  container.style.height = `${height}px`

  frame.style.width = `${width}px`
  frame.style.height = `${height - 64}px`
}

function loopTimer() {
  const currentTime = replayer.timer.timeOffset + replayer.getTimeOffset()

  document.getElementById('time')!.innerText = getTime()

  const progressPercent = 
    Math.floor(currentTime * 100) / replayer.getMetaData().totalTime

  document.getElementById('progress')!.style.width = `${progressPercent}%`
  document.getElementById('progress-indicator')!.style.left = 
    `calc(${progressPercent}% - 2px)`

  if (!isPlaying) {
    clearTimeout(timer)
    return
  }

  timer = setTimeout(loopTimer, 1000)
}

document.getElementById('seeker')!.addEventListener('click', event => {
  const el = document.getElementById('seeker')!

  const progressRect = el.getBoundingClientRect()
  const x = event.clientX - progressRect.left
  let percent = x / progressRect.width
  if (percent < 0) {
    percent = 0
  } else if (percent > 1) {
    percent = 1
  }

  const timeOffset = replayer.getMetaData().totalTime * percent

  replayer.pause()
  replayer.play(timeOffset)
})

const replayer: Replayer = new Replayer(events, {
  speed: 1,
  root: frame!,
  skipInactive: false,
  showWarning: true,
  showDebug: true,
  triggerFocus: true,
  unpackFn: unpack,
})

replayer.on('resize', (dimension) =>
  updateScale(replayer.wrapper, dimension),
)

replayer.on('start', () => {
  isPlaying = true
  loopTimer()
})

replayer.on('resume', () => {

  isPlaying = true
  loopTimer()
})

replayer.on('pause', () => {
  isPlaying = false
})

replayer.on('finish', () => {
  isPlaying = false
})

replayer.play()