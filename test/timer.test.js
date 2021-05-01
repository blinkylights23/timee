import { Timer } from '../src'
import EventEmitter from 'events'
import dayjs from 'dayjs'

jest.useFakeTimers()

describe('Timer', () => {
  test('should construct a EventEmitter instance', () => {
    const timer = new Timer()
    expect(timer).toBeInstanceOf(EventEmitter)
  })
  test('should emit a tick after one second', () => {
    const timer = new Timer()
    const listener = jest.fn()
    timer.start()
    timer.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  test('should emit a tick 10 times after 10 seconds', () => {
    const timer = new Timer()
    const listener = jest.fn()
    timer.on('tick', listener)
    timer.start()
    jest.advanceTimersByTime(10000)
    expect(listener).toHaveBeenCalledTimes(10)
  })
  test('should emit DayJS objects', () => {
    const timer = new Timer()
    let tickEvent
    const listener = jest.fn(tick => (tickEvent = tick))
    timer.on('tick', listener)
    timer.start()
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(tickEvent.type).toBe('timer')
    expect(dayjs.isDuration(tickEvent.elapsed)).toBe(true)
    expect(dayjs.isDuration(tickEvent.accumulated)).toBe(true)
  })
  describe('Pausing', () => {
    test('should start unpaused by default', () => {
      const timer = new Timer()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      timer.on('tick', listener)
      timer.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.paused).toBe(false)
      expect(listener).toHaveBeenCalledTimes(2)
    })
    test('should start paused when configured by constructor', () => {
      const timer = new Timer({ paused: true })
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      timer.on('tick', listener)
      timer.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.paused).toBe(true)
      expect(tickEvent.elapsed.asSeconds()).toBe(0)
    })
    test('should not apply time to elapsed/remaining duration when paused', () => {
      const timer = new Timer()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      timer.on('tick', listener)
      timer.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      timer.pause()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      timer.pause()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(4)
    })
  })
  describe('Reset', () => {
    test('should reset elapsed/remaining durations', () => {
      const timer = new Timer()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      timer.on('tick', listener)
      timer.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.elapsed.asSeconds()).toBe(2)
      timer.reset()
      jest.advanceTimersByTime(1000)
      expect(tickEvent.elapsed.asSeconds()).toBe(1)
    })
  })
  describe('Lap', () => {
    test('should add laps', () => {
      const timer = new Timer()
      let tickEvent
      const listener = jest.fn(tick => (tickEvent = tick))
      timer.on('tick', listener)
      timer.start()
      jest.advanceTimersByTime(2000)
      expect(tickEvent.laps).toStrictEqual([])
      timer.lap()
      jest.advanceTimersByTime(1000)
      expect(tickEvent.laps[0].asSeconds()).toBe(2)
    })
  })
})
