import TimeeBase from './base'

class Clock extends TimeeBase {
  constructor(options) {
    super(options)
    this.start()
    this.current = Date.UTC.now()
  }

  start() {
    this.interval = setInterval(() => {
      this.emit('tick', {
        type: 'clock',
        current: Date.UTC.now()
      })
    }, 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  // get current() {
  //   // return this.current.
  // }
}

export default Clock
