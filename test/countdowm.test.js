import { Countdown } from '../src'
import EventEmitter from 'events'
import dayjs from 'dayjs'

jest.useFakeTimers()

describe('Countdown', () => {
  test('should construct a EventEmitter instance', () => {
    const countdown = new Countdown({ duration: { seconds: 5 } })
    expect(countdown).toBeInstanceOf(EventEmitter)
  })
  test('should emit a tick after one second', () => {
    const countdown = new Countdown({ duration: { seconds: 5 } })
    const listener = jest.fn()
    countdown.start()
    countdown.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  test('should emit a tick 10 times after 10 seconds', () => {
    const countdown = new Countdown({ duration: { seconds: 5 } })
    const listener = jest.fn()
    countdown.on('tick', listener)
    countdown.start()
    jest.advanceTimersByTime(10000)
    expect(listener).toHaveBeenCalledTimes(10)
  })
  test('should emit DayJS objects', () => {
    const countdown = new Countdown({ duration: { seconds: 5 } })
    let tickEvent
    const listener = jest.fn(tick => (tickEvent = tick))
    countdown.on('tick', listener)
    countdown.start()
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(tickEvent.type).toBe('countdown')
    expect(dayjs.isDuration(tickEvent.duration)).toBe(true)
    expect(dayjs.isDuration(tickEvent.elapsed)).toBe(true)
    expect(dayjs.isDuration(tickEvent.remaining)).toBe(true)
    expect(dayjs.isDuration(tickEvent.accumulated)).toBe(true)
  })
  test('should emit the completed value in the tick event', () => {
    const countdown = new Countdown({ duration: { seconds: 5 } })
    let tickEvent
    const listener = jest.fn(tick => (tickEvent = tick))
    countdown.on('tick', listener)
    countdown.start()
    jest.advanceTimersByTime(2000)
    expect(tickEvent.completed).toBe(false)
    jest.advanceTimersByTime(3000)
    expect(tickEvent.completed).toBe(true)
  })
  test('should emit the completed event at the end of the countdown', () => {
    const countdown = new Countdown({ duration: { seconds: 5 } })
    const listener = jest.fn()
    countdown.on('completed', listener)
    countdown.start()
    jest.advanceTimersByTime(2000)
    expect(listener).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3000)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  describe('Pausing', () => {
    test('should start unpaused by default', () => {
      const countdown = new Countdown({ duration: { seconds: 5 } })
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      countdown.on('tick', listener)
      countdown.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.paused).toBe(false)
      expect(listener).toHaveBeenCalledTimes(2)
    })
    test('should start paused when configured by constructor', () => {
      const countdown = new Countdown({ duration: { seconds: 5 }, paused: true })
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      countdown.on('tick', listener)
      countdown.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.paused).toBe(true)
      expect(tickEvent.elapsed.asSeconds()).toBe(0)
    })
    test('should not apply time to elapsed/remaining duration when paused', () => {
      const countdown = new Countdown({ duration: { seconds: 5 } })
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      countdown.on('tick', listener)
      countdown.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      expect(tickEvent.remaining.asSeconds()).toBe(3)
      countdown.pause()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      expect(tickEvent.remaining.asSeconds()).toBe(3)
      countdown.pause()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(4)
      expect(tickEvent.remaining.asSeconds()).toBe(1)
    })
  })
  describe('Reset', () => {
    test('should reset elapsed/remaining durations', () => {
      const countdown = new Countdown({ duration: { seconds: 5 } })
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      countdown.on('tick', listener)
      countdown.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      expect(tickEvent.remaining.asSeconds()).toBe(3)
      countdown.reset()
      jest.advanceTimersByTime(1000)
      expect(tickEvent.elapsed.asSeconds()).toBe(1)
      expect(tickEvent.remaining.asSeconds()).toBe(4)
    })
  })
})
