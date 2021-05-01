# timee

_Simple time-based event-emitters for Node and browser_

This package provides a set of tools for keeping time in JavaScript. There's a `Clock` for emitting an event once per second with the current time, a `Countdown` that counts backward for a given duration, a `Timer` that works like a stopwatch counting forward (it even has a `lap()` function), and finally there's a `RateTicker` that emits events at a given rate (like 3 per second or once per 17 seconds).

`timee` has `dayjs` as a dependency and returns times and durations as `dayjs` objects so they can be easily formatted.

## Installing

```
$ npm install @paulsmith/timee
```

## Clock

`Clock` emits a `tick` event once per second with an object that includes a `current` property which holds the current time as a `dayjs` object.

```javascript
const clock = new Clock()

clock.on('tick', tick => {
  console.log(tick.current.format())
})
```

## Countdown

Give a duration, a `Countdown` will emit a `tick` event once per second, and a `completed` event after the duration has elapsed. A `Countdown` can toggle a paused/unpaused state by calling the `pause()` method. The emitter will continue to emit events even after the duration has expired. It can be stopped with the `stop()` method.

Each tick provides an object that contains:

```
{
  "duration": DayJSObj, // The original duration
  "elapsed": DayJSObj, // Non-paused time elapsed
  "remaining": DayJSObj, // Non-paused time remaining
  "accumulated": DayJSObj, // Time since start(), including time while paused
  "paused": Boolean, // Whether the Countdown is currently paused
  "completed": Boolean // Whether the Countdown is completed
}
```

```javascript
import keypress from 'keypress'

keypress(process.stdin)

const countdown = new Countdown({
  duration: { minutes: 1, seconds: 15 }
})
countdown.start()

countdown.on('tick', tick => {
  console.log(tick.remaining.format())
})

countdown.once('completed', () => {
  console.log('All done!')
  countdown.stop()
  countdown.removeAllListeners()
})

process.stdin.on('keypress', (ch, key) => {
  console.log('got "keypress"', ch, key)
  if (key && key.name == 'space') {
    countdown.pause()
  }
  if (key && key.ctrl && key.name == 'c') {
    process.exit(0)
  }
})

process.stdin.setRawMode(true)
process.stdin.resume()
```

## Timer

A `Timer` will emit a `tick` event once per second (or at a rate determined by the rate passed to the constructor). It can toggle a paused/unpaused state by calling the `pause()` method. You can accumulate an array of time marker durations by calling the `lap()` method. It can be stopped with the `stop()` method.

Each tick provides an object that contains:

```
{
  "type": "timer",
  "elapsed": DayJSObj, // Non-paused time elapsed
  "accumulated": DayJSObj, // Time since start(), including time while paused
  "paused": Boolean, // Whether the Timer is currently paused
  "laps": [
    DayJSObj,
    DayJSObj
  ]
}
```

```javascript
import { Timer } from '../dist/timee.esm.js'
import keypress from 'keypress'

keypress(process.stdin)

const timer = new Timer({ rate: 100 })
timer.start()

timer.on('tick', tick => {
  console.log({
    elapsed: tick.elapsed.format(),
    accumulated: tick.accumulated.format(),
    laps: tick.laps.map(l => l.format()),
    paused: tick.paused
  })
})

process.stdin.on('keypress', (ch, key) => {
  console.log('got "keypress"', ch, key)
  if (key && key.name == 'space') {
    timer.pause()
  }
  if (key && key.name == 'l') {
    timer.lap()
  }
  if (key && key.ctrl && key.name == 'c') {
    process.exit(0)
  }
})

process.stdin.setRawMode(true)
process.stdin.resume()
```

## RateTicker

A `RateTicker` will emit `tick` at a rate specified in the constructor. It can toggle a paused/unpaused state by calling the `pause()` method. You can increase and decrease the tick rate with the `increaseRate()` and `decreaseRate()` methods. It can be stopped with the `stop()` method.

Each tick provides an object that contains:

```
{
  "type": "rateticker",
  "elapsed": DayJSObj, // Non-paused time elapsed
  "accumulated": DayJSObj, // Time since start(), including time while paused
  "paused": Boolean, // Whether the Timer is currently paused
  "effectiveRate": 2000, // Tick once every 2000ms
  "perSecond": 0.5 // Ticks per second
}
```

```javascript
import { RateTicker } from '../dist/timee.esm.js'
import keypress from 'keypress'

keypress(process.stdin)

const timer = new RateTicker({ rate: [1, 1000] })
timer.start()

timer.on('tick', tick => {
  console.log(tick)
})

process.stdin.on('keypress', (ch, key) => {
  if (key && key.name == 'space') {
    timer.pause()
  }
  if (key && key.name == 'up') {
    timer.increaseRate()
  }
  if (key && key.name == 'down') {
    timer.decreaseRate()
  }
  if (key && key.ctrl && key.name == 'c') {
    process.exit(0)
  }
})

process.stdin.setRawMode(true)
process.stdin.resume()
```
