import { describe, expect, it } from 'vitest'
import { convert } from '../src/convert'

/** Template literal for auto formatting */
function html(
  strings: TemplateStringsArray,
  ...expressions: unknown[]
): string {
  let result = strings[0] ?? ''

  for (let i = 1, l = strings.length; i < l; i++) {
    result += expressions[i - 1]
    result += strings[i]
  }

  return result
}

describe('should', () => {
  it('works for regular HTML', () => {
    const htmlToConvert = html`<div>Hello World</div>`

    const convertedJSX = convert(htmlToConvert)

    expect(convertedJSX).toBe(`<div>Hello World</div>`)
  })

  it('works with comments', () => {
    const htmlToConvert = html`
      <div>
        <!-- This is a comment. -->
        Hello World!
      </div>
    `

    expect(convert(htmlToConvert)).toBe(`<div>
        { /* This is a comment. */ }
        Hello World!
      </div>`)
  })

  it('works with only text', () => {
    const htmlToConvert = html`Hello World!`
    expect(convert(htmlToConvert)).toBe(`"Hello World!"`)
  })
})
