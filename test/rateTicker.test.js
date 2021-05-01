import { RateTicker } from '../src'
import EventEmitter from 'events'
import dayjs from 'dayjs'

jest.useFakeTimers()

describe('RateTicker', () => {
  test('should construct a EventEmitter instance', () => {
    const clock = new RateTicker()
    expect(clock).toBeInstanceOf(EventEmitter)
  })
  test.skip('should emit the time after one second', () => {
    const clock = new RateTicker()
    const listener = jest.fn()
    clock.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  test.skip('should emit the time 10 times after 10 seconds', () => {
    const clock = new RateTicker()
    const listener = jest.fn()
    clock.on('tick', listener)
    jest.advanceTimersByTime(10000)
    expect(listener).toHaveBeenCalledTimes(10)
  })
  test.skip('should emit a correct DayJS object', () => {
    const clock = new RateTicker()
    let tickEvent
    const listener = jest.fn(tick => (tickEvent = tick))
    clock.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(tickEvent.type).toBe('clock')
    expect(tickEvent.current).toBeInstanceOf(dayjs)
  })
})
