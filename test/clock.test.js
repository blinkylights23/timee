import { Clock } from '../src'
import EventEmitter from 'events'
import dayjs from 'dayjs'

jest.useFakeTimers()

describe('Clock', () => {
  test('should construct a EventEmitter instance', () => {
    const clock = new Clock()
    expect(clock).toBeInstanceOf(EventEmitter)
  })
  test('should emit the time after one second', () => {
    const clock = new Clock()
    const listener = jest.fn()
    clock.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  test('should emit the time 10 times after 10 seconds', () => {
    const clock = new Clock()
    const listener = jest.fn()
    clock.on('tick', listener)
    jest.advanceTimersByTime(10000)
    expect(listener).toHaveBeenCalledTimes(10)
  })
  test('should emit a correct DayJS object', () => {
    const clock = new Clock()
    let tickEvent
    const listener = jest.fn(tick => (tickEvent = tick))
    clock.on('tick', listener)
    jest.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(tickEvent.type).toBe('clock')
    expect(tickEvent.current).toBeInstanceOf(dayjs)
  })
})
