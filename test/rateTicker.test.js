import { RateTicker } from '../src'
import EventEmitter from 'events'
import dayjs from 'dayjs'

jest.useFakeTimers()

describe('RateTicker', () => {
  test('should construct a EventEmitter instance', () => {
    const ticker = new RateTicker()
    expect(ticker).toBeInstanceOf(EventEmitter)
  })
  test.todo('should validate rate value from constructor')
  test('should emit a tick after one second', () => {
    const ticker = new RateTicker()
    const listener = jest.fn()
    ticker.start()
    ticker.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  test('should emit a tick 10 times after 10 seconds', () => {
    const ticker = new RateTicker()
    const listener = jest.fn()
    ticker.on('tick', listener)
    ticker.start()
    jest.advanceTimersByTime(10000)
    expect(listener).toHaveBeenCalledTimes(10)
  })
  test('should emit DayJS objects', () => {
    const ticker = new RateTicker()
    let tickEvent
    const listener = jest.fn(tick => (tickEvent = tick))
    ticker.on('tick', listener)
    ticker.start()
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(tickEvent.type).toBe('rateticker')
    expect(dayjs.isDuration(tickEvent.elapsed)).toBe(true)
    expect(dayjs.isDuration(tickEvent.accumulated)).toBe(true)
  })
  test.todo('should return per-second and effective rates')
  describe('Pausing', () => {
    test('should start unpaused by default', () => {
      const ticker = new RateTicker()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      ticker.on('tick', listener)
      ticker.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.paused).toBe(false)
      expect(listener).toHaveBeenCalledTimes(2)
    })
    test('should start paused when configured by constructor', () => {
      const ticker = new RateTicker({ paused: true })
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      ticker.on('tick', listener)
      ticker.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.paused).toBe(true)
      expect(tickEvent.elapsed.asSeconds()).toBe(0)
    })
    test('should not apply time to elapsed/remaining duration when paused', () => {
      const ticker = new RateTicker()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      ticker.on('tick', listener)
      ticker.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      ticker.pause()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      ticker.pause()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(4)
    })
  })
  describe('Reset', () => {
    test('should reset elapsed/remaining durations', () => {
      const ticker = new RateTicker()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      ticker.on('tick', listener)
      ticker.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      ticker.reset()
      jest.advanceTimersByTime(1000)
      expect(tickEvent.elapsed.asSeconds()).toBe(1)
    })
  })
  describe('Changing rate', () => {
    test.todo('should allow rate increase')
    test.todo('should allow rate decrease')
  })
})
