import TimeeBase from './base'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const defaultOptions = {
  paused: false,
  rate: 1000
}

class Timer extends TimeeBase {
  constructor(options = {}) {
    super()
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.rate = 1000
    this.paused = this.options.paused
    this._current = dayjs.duration(0)
    this.startDateTime = null
    this.pauseAccumulator = 0
    this.laps = []
  }

  start() {
    this.startDateTime = dayjs()
    this.interval = setInterval(() => {
      if (this.paused) {
        this.pauseAccumulator += this.rate
      } else {
        this._current = this._current.add(this.rate, 'milliseconds')
      }
      this.emit('tick', this.current)
    }, this.rate)
  }

  stop() {
    clearInterval(this.interval)
  }

  pause() {
    this.paused = !this.paused
  }

  reset() {
    this._current = this.duration
  }

  get accumulated() {
    const now = new Date()
    const accumulatedStart = this.startDateTime || now
    return now - accumulatedStart - this.pauseAccumulator
  }

  get elapsed() {
    if (!this.startDateTime) return null
    const now = dayjs()
    return dayjs.duration(now - this.startDateTime, 'milliseconds')
  }

  get current() {
    return {
      elapsed: this.elapsed.format(),
      accumulated: dayjs.duration(this.pauseAccumulator, 'milliseconds').format(),
      paused: this.paused
    }
  }
}

export default Timer
