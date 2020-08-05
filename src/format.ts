function padZero(time: number) {
  return Math.floor(time).toString().padStart(2, '0')
}

export function formatTime(ms: number): string {
  if (ms <= 0) {
    return '00:00'
  }

  let totalSeconds = ms / 1000

  const hours = Math.floor(totalSeconds / 3600)

  totalSeconds %= 3600

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (hours) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }

  return `${padZero(minutes)}:${padZero(seconds)}`
}
