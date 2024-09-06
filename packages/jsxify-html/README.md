# jsxify-html

`jsxify-html` is a utility that converts HTML strings into JSX syntax, making it easier to integrate HTML content into React components. It offers customization options through the `JsxifyHtml` class, allowing users to control specific aspects of the conversion process.

## Installation

You can install `jsxify-html` via npm:

```bash
npm install jsxify-html
```

Or via pnpm:

```bash
pnpm add jsxify-html
```

## Usage

### Basic Usage with `convert` Function

The simplest way to use `jsxify-html` is through the `convert` function:

```ts
import { convert } from 'jsxify-html'

const jsx = convert('<div>Hello World</div>')
```

### Advanced Usage with `JsxifyHtml` Class

For more control over the conversion process, you can create an instance of the `JsxifyHtml` class with custom options:

```ts
import { JsxifyHtml } from 'jsxify-html'

const jsxifier = new JsxifyHtml({
  preservePreTags: true,
  xml: true
})

const jsx = jsxifier.convert('<div>Hello World</div>')
```

## Options

The `JsxifyHtml` class accepts an `Options` object to customize its behavior:

```ts
interface Options {
  /**
   * Preserves the formatting within <pre> tags when set to true.
   */
  preservePreTags?: boolean
  /**
   * Recommended way of configuring htmlparser2 when wanting to parse XML.
   */
  xml?: boolean
  /**
   * Configures the `html-entities` plugin rules for handling HTML entities.
   * For detailed configuration options, please refer to the documentation: <a href="https://www.npmjs.com/package/html-entities">html-entities</a>
   * @default { mode: 'nonAsciiPrintable', level: 'html5' }
   */
  htmlEntities?: EncodeOptions
}
```

### Option Details

- **`preservePreTags`**: When `true`, the content within `<pre>` tags will be preserved with its original formatting.
- **`xml`**: If set to `true`, the parser is configured to handle XML parsing, which may be necessary depending on the HTML content.
- **`htmlEntities`**: This option allows you to customize the behavior of the html-entities library, which is used by default to handle special characters in the HTML. For more detailed configuration options, please refer to the <a href="https://www.npmjs.com/package/html-entities">html-entities documentation</a>.

### Example

```ts
import { JsxifyHtml } from 'jsxify-html'

const jsxifier = new JsxifyHtml({
  preservePreTags: false,
  xml: true
})

const jsx = jsxifier.convert(`
  <div>
    <h1>Title</h1>
    <pre>
      function helloWorld() {
        console.log("Hello, World!");
      }
    </pre>
  </div>
`)
```

## API

### `convert(html?: string): undefined | string`

A convenient function that wraps the `JsxifyHtml` class for simple use cases.

- `html`: The HTML string you want to convert to JSX.
- Returns: The converted JSX string or `undefined` if no HTML string is provided.

### `JsxifyHtml`

The main class providing detailed control over the conversion process.

- **`constructor(options?: Options)`**: Initializes the `JsxifyHtml` instance with optional configuration.
- **`convert(html?: string): undefined | string`**: Converts the provided HTML string to JSX.

## License

This project is licensed under the MIT License.
