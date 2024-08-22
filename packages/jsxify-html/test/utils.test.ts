import { describe, expect, it, vi } from 'vitest'

import * as utils from '../src/utils'

describe('utils', () => {
  it('should return a false when is blank string', () => {
    expect(utils.hasString(' ')).toBeFalsy()
    expect(utils.hasString('')).toBeFalsy()
    expect(utils.hasString(' true')).toBeTruthy()
  })

  it('foreach object', () => {
    const attribs = { class: 'container active', style: 'background-color: red' }

    const watch = vi.fn()
    utils.forEach(attribs, watch)

    expect(watch).toBeCalledTimes(2)
    expect(watch).toHaveBeenCalledWith('container active', 'class')
    expect(watch).toHaveBeenCalledWith('background-color: red', 'style')
    // expect(watch).toBeCalledWith(2, 2)
  })

  it('object map', () => {
    const attribs = { class: 'container active', style: 'background-color: red' }

    const watch = vi.fn()
    const keys = utils.map(attribs, (key, value) => {
      watch(key, value)
      return key
    })

    expect(keys).toEqual(['class', 'style'])
    expect(watch).toHaveBeenCalledTimes(2)
    expect(watch).toHaveBeenCalledWith('class', 'container active')
    expect(watch).toHaveBeenCalledWith('style', 'background-color: red')
  })
})
