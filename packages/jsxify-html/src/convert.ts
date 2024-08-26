import * as cheerio from 'cheerio'
import type { ChildNode } from 'domhandler'
import { ElementType } from 'domelementtype'
import generate from '@babel/generator'

import type {
  BlockStatement,
  ExpressionStatement,
  JSXElement,
  JSXExpressionContainer,
  JSXText,
  Node,
} from '@babel/types'
import {
  addComment,
  blockStatement,
  expressionStatement,
  identifier,
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
  objectExpression,
  objectProperty,
  stringLiteral,
} from '@babel/types'
import { encode } from 'html-entities'

import * as utils from './utils'
import { convertAttribute, createJSXAttribute } from './convert-attribute'
import type { Options } from './types'

export class JsxifyHtml {
  private $: cheerio.CheerioAPI

  constructor(private options?: Options) {
    this.$ = cheerio.load('', { xml: options?.xml })
  }

  convert(html?: string): undefined | string {
    if (!utils.hasString(html))
      return undefined

    html = html?.trim()

    const htmlAst = this.$.parseHTML(html!)

    const babelAst = this.wrapWithFragment(htmlAst)

    let babelCode = generate(babelAst, { concise: true }).code

    if (babelCode.endsWith(';'))
      babelCode = babelCode.slice(0, -1)

    return babelCode
  }

  private wrapWithFragment(ast: ChildNode[]): Node {
    if (ast.length === 1) {
      return this.htmlToBabelAst(ast[0], true)
    }

    return expressionStatement(
      jsxFragment(
        jsxOpeningFragment(),
        jsxClosingFragment(),
        ast.flatMap(childNode => this.htmlToBabelAst(childNode, false)),
      ),
    )
  }

  private htmlToBabelAst(node: ChildNode, isRoot: true): ExpressionStatement | BlockStatement
  private htmlToBabelAst(node: ChildNode, isRoot: false): (JSXElement | JSXExpressionContainer | JSXText)[]
  private htmlToBabelAst(node: ChildNode, isRoot: boolean): ExpressionStatement | BlockStatement | (JSXElement | JSXExpressionContainer | JSXText)[] {
    if (node.type === ElementType.Tag) {
      const element = this.createJSXElement(node.name, node.attribs, node.childNodes)
      if (isRoot)
        return expressionStatement(element)
      return [element]
    }

    if (node.type === ElementType.Text) {
      const nodeValue = node.nodeValue
      return isRoot
        ? expressionStatement(stringLiteral(nodeValue))
        : [jsxText(this.encodeText(nodeValue).replace(/(\{+|\}+)/g, '{"$1"}'))]
    }

    if (node.type === ElementType.Comment) {
      if (isRoot) {
        const block = blockStatement([])
        addComment(block, 'inner', node.data, false)

        return block
      }
      const emptyExpression = jsxEmptyExpression()
      addComment(emptyExpression, 'inner', node.data, false)
      return [jsxExpressionContainer(emptyExpression)]
    }

    throw new Error(`Unknown node type: ${node.type}`)
  }

  private createJSXElement(tagName: string, attribs: Record<string, string | number>, children: ChildNode[]): JSXElement {
    const hasChildNodes = children.length > 0

    if (tagName === 'pre' && this.options?.preservePreTags) {
      const htmlString = `${this.$.html(children)}`

      const preAttr = createJSXAttribute('dangerouslySetInnerHTML', objectExpression([
        objectProperty(identifier('__html'), stringLiteral(htmlString)),
      ]))

      const mergeAttrs = [...convertAttribute(attribs), preAttr]

      return jsxElement(
        jsxOpeningElement(jsxIdentifier('pre'), mergeAttrs, true),
        null,
        [],
      )
    }

    return jsxElement(
      jsxOpeningElement(
        jsxIdentifier(tagName),
        convertAttribute(attribs),
        !hasChildNodes,
      ),
      jsxClosingElement(jsxIdentifier(tagName)),
      children.flatMap(node => this.htmlToBabelAst(node, false)!).filter(Boolean),
    )
  }

  private encodeText(text: string): string {
    return encode(text, { mode: 'nonAsciiPrintable', level: 'html5' })
  }
}

export function convert(html?: string): undefined | string {
  return new JsxifyHtml({ xml: true }).convert(html)
}
