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
    this.rate = this.options.rate
    this.paused = this.options.paused
    this._current = dayjs.duration(0)
    this.startDateTime = null
    this.laps = []
  }

  start() {
    this.startDateTime = dayjs()
    this.interval = setInterval(() => {
      if (!this.paused) {
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

  lap() {
    if (!this.startDateTime) return null
    if (this.paused) return null
    this.laps.push(this._current)
  }

  get elapsed() {
    if (!this.startDateTime) return null
    if (this.completed) return this.duration
    return this._current
  }

  get accumulated() {
    if (!this.startDateTime) return null
    const now = dayjs()
    return dayjs.duration(now - this.startDateTime, 'milliseconds')
  }

  get current() {
    return {
      elapsed: this.elapsed,
      accumulated: this.accumulated,
      laps: this.laps,
      paused: this.paused
    }
  }
}

export default Timer
