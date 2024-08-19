import * as cheerio from 'cheerio'
import type { ChildNode } from 'domhandler'
import { ElementType } from 'domelementtype'
import generate from '@babel/generator'

import type {
  ExpressionStatement,
  JSXElement,
  JSXExpressionContainer,
  JSXText,
} from '@babel/types'
import {
  addComment,
  expressionStatement,
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxEmptyExpression,
  jsxExpressionContainer,
  jsxFragment,
  jsxIdentifier,
  jsxOpeningElement,
  jsxOpeningFragment,
  jsxText,
  stringLiteral,
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

  let babelAst: ExpressionStatement

  if (htmlAst.length === 1) {
    babelAst = htmlToBabelAst(htmlAst[0], true)
  }
  else {
    babelAst = expressionStatement(
      jsxFragment(
        jsxOpeningFragment(),
        jsxClosingFragment(),
        htmlAst.flatMap(childNode => htmlToBabelAst(childNode, false)),
      ),
    )
  }

  let babelCode = generate(babelAst, { concise: true }).code

  if (babelCode.endsWith(';'))
    babelCode = babelCode.slice(0, -1)

  return babelCode
}

function htmlToBabelAst(node: ChildNode, isTopLevel: true): ExpressionStatement
function htmlToBabelAst(node: ChildNode, isTopLevel: false): (JSXElement | JSXExpressionContainer | JSXText)[]
function htmlToBabelAst(node: ChildNode, isTopLevel: boolean): ExpressionStatement | (JSXElement | JSXExpressionContainer | JSXText)[] {
  if (node.type === ElementType.Tag) {
    const element = createJSXElement(node.name, node.attribs, node.childNodes)
    if (isTopLevel)
      return expressionStatement(element)
    return [element]
  }

  if (node.type === ElementType.Text) {
    const nodeValue = node.nodeValue
    return isTopLevel
      ? expressionStatement(stringLiteral(nodeValue))
      : [jsxText(encodeText(nodeValue))]
  }

  if (node.type === ElementType.Comment) {
    const emptyExpression = jsxEmptyExpression()
    addComment(emptyExpression, 'inner', node.data, false)
    return [jsxExpressionContainer(emptyExpression)]
  }

  throw new Error(`Unknown node type: ${node.type}`)
}

function createJSXElement(tagName: string, attribs: Record<string, string | number>, children: ChildNode[]): JSXElement {
  const hasChildNodes = children.length > 0
  return jsxElement(
    jsxOpeningElement(
      jsxIdentifier(tagName),
      convertAttribute(attribs),
      !hasChildNodes,
    ),
    jsxClosingElement(jsxIdentifier(tagName)),
    children.flatMap(node => htmlToBabelAst(node, false)!).filter(Boolean),
  )
}

function encodeText(text: string): string {
  return encode(text, { mode: 'nonAsciiPrintable', level: 'html5' })
}
