import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import { ElementType } from 'domelementtype'
import generate from '@babel/generator'

import type {
  JSXElement,
  ObjectProperty,
} from '@babel/types'
import {
  identifier,
  jsxAttribute,
  jsxClosingElement,
  jsxElement,
  jsxExpressionContainer,
  jsxIdentifier,
  jsxOpeningElement,
  numericLiteral,
  objectProperty,
  stringLiteral,
} from '@babel/types'
import parseStyleString from 'style-to-object'

import * as utils from './utils'

export function convert(html?: string): undefined | string {
  if (!utils.hasString(html))
    return undefined

  html = html?.trim()

  const $ = cheerio.load('', { xml: true })
  const htmlAst = $.parseHTML(html!)

  const babelAst = htmlToBabelAst(htmlAst[0])

  if (!babelAst)
    return

  // console.log('generate', generate(babelAst, { concise: true }).code)

  return generate(babelAst, { concise: true }).code

  // return `<div className="container active" style={{color: 'red', padding: 10, border: '1px solid #000', '--bg-color': '#fff'}}>hello</div>`
}

function htmlToBabelAst(node: AnyNode): JSXElement | undefined {
  if (node.type === ElementType.Tag)
    return createJSXElement(node.name, node.attribs)
}

// Matches a px value, e.g. `40px`
const MATCH_PX_VALUE = /^(\d+)px$/

function createJSXElement(tagName: string, attribs: Record<string, string | number>): JSXElement {
  const attributes = utils.map(attribs, (key, value) => {
    const properties: Array<ObjectProperty> = []

    if (key === 'style') {
      parseStyleString(value as string, (name, value) => {
        const pxValueMatch = value.match(MATCH_PX_VALUE)
        properties.push(
          objectProperty(
            identifier(name),
            pxValueMatch !== null
              ? numericLiteral(Number(pxValueMatch[1]))
              : stringLiteral(value),
          ),
        )
      })
    }

    if (value === null)
      return jsxAttribute(jsxIdentifier(key), null)

    switch (typeof value) {
      case 'number':
        return jsxAttribute(
          jsxIdentifier(key),
          jsxExpressionContainer(numericLiteral(value)),
        )
      case 'string':
        return jsxAttribute(jsxIdentifier(key), stringLiteral(value))
      default:
        return jsxAttribute(jsxIdentifier(key), jsxExpressionContainer(value))
    }
  })

  return jsxElement(
    jsxOpeningElement(jsxIdentifier(tagName), attributes),
    jsxClosingElement(jsxIdentifier(tagName)),
    // jsxAttribute(objectExpression(properties)),
    [],
  )
}
