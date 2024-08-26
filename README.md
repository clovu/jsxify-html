# My Project

The primary focus of this project is to provide utilities for handling HTML and JSX in a React environment.

## Packages

### `jsxify-html`

[`jsxify-html`](./packages/jsxify-html) is one of the core packages in this project. It provides utilities for converting HTML to JSX syntax, making it easier to integrate HTML content into React components.

- **Installation:** `pnpm add jsxify-html`
- **Repository:** [jsxify-html](./packages/jsxify-html)
- **Documentation:** See [jsxify-html README](./packages/jsxify-html/README.md) for more details.

#### Usage Example

```ts
import { convert } from 'jsxify-html'

const jsx = convert('<div>Hello World</div>')
```

## Getting Started

To get started with this project, first clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
pnpm install
```

### Running Tests

To run the tests for all packages, use:

```bash
pnpm test
```

### Building Packages

To build all packages in the monorepo, run:

```bash
pnpm build
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](./CONTRIBUTING.md) before submitting a pull request.
