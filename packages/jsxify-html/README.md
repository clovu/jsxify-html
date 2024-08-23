# jsxify-html

`jsxify-html` is a lightweight utility that converts HTML strings into JSX syntax, making it easier to integrate HTML content into React components. The library also handles content within `<pre>` tags by rendering it with `dangerouslySetInnerHTML`, preserving the original formatting.

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

Import the `convert` function and use it to convert your HTML string to JSX:

```ts
import { convert } from 'jsxify-html'

const jsx = convert(`<div>Hello World</div>`)
```

### Handling `<pre>` Tags

The `convert` function ensures that content within `<pre>` tags is rendered using `dangerouslySetInnerHTML` to maintain the original formatting. This is particularly useful when dealing with preformatted text, as React would otherwise strip out important whitespace and line breaks.

## API

### `convert(html?: string): undefined | string`

- `html`: The HTML string you want to convert to JSX.
- Returns: The converted JSX string or `undefined` if no HTML string is provided.

## Example

```ts
import { convert } from 'jsxify-html'

const htmlContent = `
  <div>
    <h1>Welcome to jsxify-html</h1>
    <pre>
      function helloWorld() {
        console.log("Hello, World!");
      }
    </pre>
  </div>
`

const jsx = convert(htmlContent)
console.log(jsx)
```

In this example, the HTML string is converted to JSX, and the content inside the `<pre>` tag is preserved with proper formatting.

## License

This project is licensed under the MIT License.
