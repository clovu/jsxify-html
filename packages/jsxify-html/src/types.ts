import type { EncodeOptions } from 'html-entities'

export interface Options {
  /**
   * This name suggests that the function will preserve the formatting within <pre> tags when set to true.
   */
  preservePreTags?: boolean
  /**
   *  Recommended way of configuring htmlparser2 when wanting to parse XML.
   */
  xml?: boolean
  /**
   * Configures the `html-entities` plugin rules for handling HTML entities.
   * For detailed configuration options, please refer to the documentation: <a href="https://www.npmjs.com/package/html-entities">html-entities</a>
   * @default { mode: 'nonAsciiPrintable', level: 'html5' }
   */
  htmlEntities?: EncodeOptions
}

export type { EncodeOptions }
