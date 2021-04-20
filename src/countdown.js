import TimeeBase from './base'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const defaultOptions = {
  paused: false,
  duration: {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 20
  }
}

class Countdown extends TimeeBase {
  constructor(options = {}) {
    super()
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.rate = 1000
    this.paused = this.options.paused
    this.duration = dayjs.duration(this.options.duration)
    this._current = dayjs.duration(this.options.duration)
    this.startDateTime = null
  }

  start() {
    this.startDateTime = dayjs()
    this.interval = setInterval(() => {
      if (!this.paused) {
        this._current = this._current.subtract(this.rate, 'milliseconds')
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

  get elapsed() {
    if (!this.startDateTime) return null
    if (this.completed) return this.duration
    return this.duration.subtract(this._current)
  }

  get remaining() {
    if (!this.startDateTime) return null
    if (this.completed) return dayjs.duration(0)
    return this._current
  }

  get accumulated() {
    if (!this.startDateTime) return null
    const now = dayjs()
    return dayjs.duration(now - this.startDateTime, 'milliseconds')
  }

  get completed() {
    return this._current.asMilliseconds() <= 0
  }

  get current() {
    return {
      duration: this.duration,
      elapsed: this.elapsed,
      remaining: this.remaining,
      accumulated: this.accumulated,
      paused: this.paused,
      completed: this.completed
    }
  }
}

export default Countdown
