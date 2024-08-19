import * as cheerio from 'cheerio'
import type { ChildNode } from 'domhandler'
import { ElementType } from 'domelementtype'
import generate from '@babel/generator'

import type {
  JSXElement,
  JSXFragment,
  JSXText,
} from '@babel/types'
import {
  jsxClosingElement,
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
  jsxText,
} from '@babel/types'
import { encode } from 'html-entities'

import * as utils from './utils'
import { convertAttribute } from './convert-attribute'

export function convert(html?: string): undefined | string {
  if (!utils.hasString(html))
    return undefined

  html = html?.trim()

  const $ = cheerio.load('', { xml: true })
  const htmlAst = $.parseHTML(html!)

  const babelAst = htmlToBabelAst(htmlAst[0])

  if (!babelAst)
    return

  return generate(babelAst, { concise: true }).code
}

function htmlToBabelAst(node: ChildNode): JSXElement | JSXFragment | JSXText | undefined {
  if (node.type === ElementType.Tag)
    return createJSXElement(node.name, node.attribs, node.childNodes)

  if (node.type === ElementType.Text) {
    const nodeValue = node.nodeValue
    // return jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [jsxText(encodeText(nodeValue))])
    return jsxText(encodeText(nodeValue))
  }
}

function createJSXElement(tagName: string, attribs: Record<string, string | number>, children: ChildNode[]): JSXElement {
  const hasChildNodes = children.length > 0
  return jsxElement(
    jsxOpeningElement(jsxIdentifier(tagName), convertAttribute(attribs), !hasChildNodes),
    jsxClosingElement(jsxIdentifier(tagName)),
    children.flatMap(node => htmlToBabelAst(node)!).filter(Boolean),
  )
}

function encodeText(text: string): string {
  return encode(text, { mode: 'nonAsciiPrintable', level: 'html5' })
}
