import TimeeBase from './base'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const defaultOptions = {
  paused: false,
  rate: [1, 1000]
}

class RateTicker extends TimeeBase {
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
  }

  _validateRate() {}

  start() {
    this.startDateTime = dayjs()
    this.interval = setInterval(this._startInterval.bind(this), this.effectiveRate)
  }

  _startInterval() {
    if (!this.paused) {
      this._current = this._current.add(this.effectiveRate, 'milliseconds')
    }
    this.emit('tick', this.current)
  }

  stop() {
    clearInterval(this.interval)
  }

  pause() {
    this.paused = !this.paused
  }

  reset() {
    this._current = dayjs.duration(0)
  }

  increaseRate() {
    this.rate = [this.rate[0], this.rate[1] - 100]
    clearInterval(this.interval)
    this.interval = setInterval(this._startInterval.bind(this), this.effectiveRate)
  }

  decreaseRate() {
    this.rate = [this.rate[0], this.rate[1] + 100]
    clearInterval(this.interval)
    this.interval = setInterval(this._startInterval.bind(this), this.effectiveRate)
  }

  get effectiveRate() {
    return Math.floor(this.rate[1] / this.rate[0])
  }

  get perSecond() {
    return (1000 / this.effectiveRate).toFixed(1)
  }

  get elapsed() {
    if (!this.startDateTime) return null
    return this._current
  }

  get accumulated() {
    if (!this.startDateTime) return null
    const now = dayjs()
    return dayjs.duration(now - this.startDateTime, 'milliseconds')
  }

  get current() {
    return {
      type: 'rateticker',
      elapsed: this.elapsed,
      accumulated: this.accumulated,
      effectiveRate: this.effectiveRate,
      perSecond: this.perSecond,
      paused: this.paused
    }
  }
}

export default RateTicker
