import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import { ElementType } from 'domelementtype'
import generate from '@babel/generator'

import type {
  Expression,
  JSXAttribute,
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
  objectExpression,
  objectProperty,
  stringLiteral,
} from '@babel/types'
import parseStyleString from 'style-to-object'

import * as utils from './utils'
import possibleStandardNames from './attributes'

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

function htmlToBabelAst(node: AnyNode): JSXElement | undefined {
  if (node.type === ElementType.Tag)
    return createJSXElement(node.name, node.attribs)
}

// Matches a px value, e.g. `40px`
const MATCH_PX_VALUE = /^(\d+)px$/

function createJSXElement(tagName: string, attribs: Record<string, string | number>): JSXElement {
  const attributes = utils.map(attribs, (attributeName, attributeValue) => {
    const properties: Array<ObjectProperty> = []

    if (attributeName === 'style') {
      parseStyleString(attributeValue as string, (name, value) => {
        const pxValueMatch = value.match(MATCH_PX_VALUE)
        properties.push(
          objectProperty(
            identifier(camelize(name)),
            pxValueMatch !== null
              ? numericLiteral(Number(pxValueMatch[1]))
              : stringLiteral(value),
          ),
        )
      })

      return createJSXAttribute(attributeName, objectExpression(properties))
    }

    if (possibleStandardNames.has(attributeName)) {
      const jsxName = possibleStandardNames.get(attributeName)!
      return createJSXAttribute(jsxName, attributeValue)
    }

    if (attributeValue === null)
      return jsxAttribute(jsxIdentifier(attributeName), null)

    switch (typeof attributeValue) {
      case 'number':
        return jsxAttribute(
          jsxIdentifier(attributeName),
          jsxExpressionContainer(numericLiteral(attributeValue)),
        )
      case 'string':
        return jsxAttribute(jsxIdentifier(attributeName), stringLiteral(attributeValue))
      default:
        return jsxAttribute(jsxIdentifier(attributeName), jsxExpressionContainer(attributeValue))
    }
  })

  return jsxElement(
    jsxOpeningElement(jsxIdentifier(tagName), attributes),
    jsxClosingElement(jsxIdentifier(tagName)),
    // jsxAttribute(objectExpression(properties)),
    [],
  )
}

function createJSXAttribute(name: string, value: string | number | Expression): JSXAttribute {
  if (value == null)
    return jsxAttribute(jsxIdentifier(name), null)

  switch (typeof value) {
    case 'number':
      return jsxAttribute(
        jsxIdentifier(name),
        jsxExpressionContainer(numericLiteral(value)),
      )
    case 'string':
      return jsxAttribute(jsxIdentifier(name), stringLiteral(value))
    default:
      return jsxAttribute(jsxIdentifier(name), jsxExpressionContainer(value))
  }
}

const CAMELIZE = /[\-:]([a-z])/g
const capitalize = (token: string): string => token[1]?.toUpperCase()

const IS_CSS_VARIBALE = /^--\w+/

function camelize(str: string): string {
  // Skip the attribute if it is a css variable. e.g. style="--bgColor: red"
  if (IS_CSS_VARIBALE.test(str))
    return `"${str}"`
  return str.replace(CAMELIZE, capitalize)
}
