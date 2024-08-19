import { describe, it } from 'vitest'

import * as cheerio from 'cheerio'

describe('jsdom', () => {
  it('cheerio', () => {
    const html = '<Hello /><div class="container active" style="color: red; padding: 10px; border: 1px solid #000; --bg-color: #fff">hello</div>'
    const $ = cheerio.load(html, {
      xml: true,
    })
    // eslint-disable-next-line no-console
    console.log($.root()[0])
  })
})
