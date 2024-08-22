import { describe, expect, it } from 'vitest'
import { splitMergeString } from '../src/split-merge-string'

describe('split merge string', () => {
  it('should split merge string', () => {
    const parts = splitMergeString(`function () { console.log() };`)

    expect(parts).toEqual([
      { value: 'function () ', type: 'string' },
      { value: '{ console.log() }', type: 'merge' },
      { value: ';', type: 'string' },
    ])
  })

  it ('should handle nested {} correctly', () => {
    const parts = splitMergeString(`Hello {{ hello }} user name`)

    expect(parts).toEqual([
      { value: 'Hello ', type: 'string' },
      { value: '{{ hello }}', type: 'merge' },
      { value: ' user name', type: 'string' },
    ])
  })

  // it('should handle unpaired {} correctly', () => {
  //   const parts = splitMergeString(`right } Hello { hello user {{ name {clover you}`)
  //   console.log(parts)
  //   expect(parts).toEqual([
  //     { value: 'right } Hello { hello user {{ name', type: 'string' },
  //   ])
  // })
})
