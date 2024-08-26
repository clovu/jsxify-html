import { describe, expect, it } from 'vitest'
import { JsxifyHtml, convert } from '../src/convert'
import possibleStandardNames from '../src/attributes'

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

  it('works with only comment', () => {
    const htmlToConvert = html`<!-- This is a comment. -->`
    expect(convert(htmlToConvert)).toBe(`{ /* This is a comment. */ }`)
  })

  it('works with singular tags', () => {
    const htmlToConvert = html`<div>Hello <br /> World!</div>`
    expect(convert(htmlToConvert)).toBe(`<div>Hello <br /> World!</div>`)
  })

  it('slef-closes emepty element', () => {
    const htmlToConvert = html`<div></div>`
    expect(convert(htmlToConvert)).toBe(`<div />`)
  })

  it('converts class to className', () => {
    const htmlToConvert = html`<div class="container">HelloWorld!</div>`
    expect(convert(htmlToConvert)).toBe(`<div className="container">HelloWorld!</div>`)
  })

  it('style string to object', () => {
    const htmlToConvert = html`<div style="color: red; background: red;">HelloWorld!</div>`
    expect(convert(htmlToConvert)).toBe(`<div style={{ color: "red", background: "red" }}>HelloWorld!</div>`)
  })

  it('converts react attributes', () => {
    let [htmlAttrs, jsxAttrs] = ['', '']

    for (const [htmlName, reactName] of possibleStandardNames) {
      if (htmlName === 'style' || htmlName === 'class')
        continue

      htmlAttrs += ` ${htmlName}="s"`
      jsxAttrs += ` ${reactName}="s"`
    }

    const htmlToConvert = html`<div${htmlAttrs}>HelloWorld</div>`

    expect(convert(htmlToConvert)).toBe(`<div${jsxAttrs}>HelloWorld</div>`)
  })

  it('converts style tag includes px values to numbers', () => {
    const htmlToConvert = html`<div style="padding: 10px; height: 15px; width: 20px;">HelloWorld</div>`

    expect(convert(htmlToConvert)).toBe(`<div style={{ padding: 10, height: 15, width: 20 }}>HelloWorld</div>`)
  })

  it('works with adjacent elements', () => {
    const htmlToConvert = html`<div>Hello World</div> -- <div>Hello World</div>`

    expect(convert(htmlToConvert)).toBe(`<><div>Hello World</div> -- <div>Hello World</div></>`)
  })

  it('tag name are not processed', () => {
    const htmlToConvert = html`<Hello>Hello World</Hello>`

    expect(convert(htmlToConvert)).toBe(`<Hello>Hello World</Hello>`)
  })

  it('works with {}', () => {
    const htmlToConvert = html`<code>function () { console.log('Hello World!') }</code>`

    expect(convert(htmlToConvert)).toBe(`<code>function () {"{"} console.log(&apos;Hello World!&apos;) {"}"}</code>`)
  })

  it('render pre tag with dangerouslySetInnerHTML', () => {
    const htmlToConvert = html`<div><pre><code>function () { console.log('Hello World!') }</code></pre></div>`

    const result = new JsxifyHtml({ preservePreTags: true, xml: true }).convert(htmlToConvert)
    expect(result).toBe(`<div><pre dangerouslySetInnerHTML={{ __html: "<code>function () { console.log(&apos;Hello World!&apos;) }</code>" }} /></div>`)
  })
})
