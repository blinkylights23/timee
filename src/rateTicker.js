import TimeeBase from './base'

const defaultOptions = {
  rate: 1000,
  paused: true
}

class RateTicker extends TimeeBase {
  constructor(options) {
    super()
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.rate = this.options.rate
    this.paused = this.options.paused
    this.startDateTime = null
    this.pauseAccumulator = 0
  }

  start() {
    console.error('Start not implemented')
  }

  stop() {
    console.error('Stop not implemented')
  }

  pause() {
    console.error('Pause not implemented')
  }

  reset() {
    console.error('Reset not implemented')
  }

  get accumulated() {
    const now = joda.LocalDateTime.now(joda.ZoneOffset.UTC)
    const accumulatedStart = this.startDateTime || now
    return now - accumulatedStart - this.pauseAccumulator
  }

  get elapsed() {
    const now = joda.LocalDateTime.now(joda.ZoneOffset.UTC)
    const accumulatedStart = this.startDateTime || now
    return now - accumulatedStart
  }
}

export default RateTicker
