import TimeeBase from './base'

class Clock extends TimeeBase {
  constructor(options) {
    super(options)
    this.alarms = []
    this.start()
    this._current = new Date()
  }

  start() {
    this.interval = setInterval(() => {
      this._current = new Date()
      this.emit('tick', this.current)
    }, 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  setAlarm() {}

  get current() {
    return {
      type: 'clock',
      current: this._current,
      alarms: this.alarms
    }
  }
}

export default Clock
