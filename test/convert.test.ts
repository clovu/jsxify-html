import { describe, expect, it } from 'vitest'
import { convert } from '../src/convert'

describe('should', () => {
  it('convert', () => {
    const jsx = convert(`<div class="container active" style="color: red; padding: 10px; border: 1px solid #000; --bg-color: #fff"></div>`)
    expect(jsx).toEqual(`<div className="container active" style={{ color: "red", padding: 10, border: "1px solid #000", "--bg-color": "#fff" }} />`)
  })
})
