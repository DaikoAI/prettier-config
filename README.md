# @daikolabs/prettier-config

Daiko Labs shared Prettier configuration (shareable config).

For the official approach, see Prettier docs: [Sharing configurations](https://prettier.io/docs/sharing-configurations).

## What this config includes

### Bundled plugins

This package bundles the plugins it uses (so consumers only need to install `prettier`).

| Plugin | Version (bundled) | Why it’s included | Link |
| --- | --- | --- | --- |
| `prettier-plugin-organize-imports` | `4.3.0` | Organizes/sorts imports during formatting. |  |
| `@prettier/plugin-oxc` | `0.1.0` | Adds the OXC-based parser for faster JS/TS formatting. | [prettier/prettier `packages/plugin-oxc`](https://github.com/prettier/prettier/tree/main/packages/plugin-oxc) |

### Prettier options (from `index.ts`)

| Option | Value | Notes |
| --- | --- | --- |
| `printWidth` | `120` | Maximum line length before wrapping. |
| `arrowParens` | `"avoid"` | Omits parentheses when possible for single-arg arrow functions. |
| `useTabs` | `false` | Uses spaces for indentation. |
| `tabWidth` | `2` | Indentation size. |
| `singleQuote` | `false` | Uses double quotes where applicable. |
| `bracketSpacing` | `true` | Prints spaces between brackets in object literals. |
| `bracketSameLine` | `false` | Places the closing bracket of JSX/HTML on a new line. |
| `experimentalTernaries` | `true` | Enables experimental ternary formatting. |
| `plugins` | `["prettier-plugin-organize-imports", "@prettier/plugin-oxc"]` | Plugins loaded by this config. |

## Install

This package provides a shareable config and bundles the required plugins. Install `prettier` in the consumer project.

```bash
npm i -D @daikolabs/prettier-config prettier
```

## Usage

Set it in `package.json`.

```json
{
  "prettier": "@daikolabs/prettier-config"
}
```

## Extending (overrides)

If you want to override only a subset of settings in the consumer project, create `.prettierrc.mjs`, import the base config, and spread it.

```js
import base from "@daikolabs/prettier-config";

/** @type {import("prettier").Config} */
export default {
  ...base,
  // Example: override settings per project
  // semi: false,
};
```

## Recommended additional plugins

### Frontend projects (Tailwind CSS)

For frontend projects using Tailwind CSS, it’s recommended to also use `prettier-plugin-tailwindcss` to automatically sort Tailwind classes.

| Plugin | Install in the consumer project | Notes |
| --- | --- | --- |
| `prettier-plugin-tailwindcss` | `npm i -D prettier-plugin-tailwindcss` | Append it to `plugins` (it’s commonly recommended to keep it last). See [tailwindlabs/prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss). |

You can add other project-specific plugins in the same way (by extending and appending to `plugins`).

Example override that keeps the base plugins and adds Tailwind:

```js
import base from "@daikolabs/prettier-config";

/** @type {import("prettier").Config} */
export default {
  ...base,
  plugins: [...(base.plugins ?? []), "prettier-plugin-tailwindcss"],
};
```

<details>
<summary><strong>Maintainers (repository maintenance)</strong></summary>

### Development (TypeScript source)

The config is maintained in `index.ts`. On publish, we build `dist/index.mjs` (Prettier reads `dist/index.mjs`).

```bash
npm run build
```

### Publishing (CI via GitHub Actions)

This repository uses semantic-release to automatically version and publish to npm on pushes to `main` (commit messages must follow Conventional Commits).

Note: semantic-release in this repo requires **Node `>=24.10.0`** (the workflow pins Node `24.10.0`).

#### Required environment variables (GitHub Actions)

The workflow passes these environment variables to semantic-release:

- **`GITHUB_TOKEN`**: provided automatically by GitHub Actions (`secrets.GITHUB_TOKEN`).
  - Used to create GitHub releases / comments, and to push release commits (e.g. changelog).
- **`NPM_TOKEN`**: must be configured in GitHub Repository Secrets.
  - Used by `@semantic-release/npm` to publish to npm.

Note: the workflow also sets `NODE_AUTH_TOKEN` to the same value as `NPM_TOKEN` for npm CLI compatibility. You only need to manage **one** secret (`NPM_TOKEN`).

#### One-time setup steps

- **npm**:
  - This package is published to the **`@daikolabs`** scope (`@daikolabs/prettier-config`). Create an automation token (or access token) that has permission to publish under the **`@daikolabs`** organization.
  - Add it to GitHub Repository Secrets as **`NPM_TOKEN`**.
  - If the `@daikolabs` org enforces 2FA for publishing, use an **automation token** (recommended) or follow your org policy for CI publishing.
- **GitHub**:
  - Ensure the Actions workflow has permissions to write to contents (this repo’s `release.yml` requests `contents: write`).
  - Protect `main` as you like, but note releases run on push to `main`.

#### Release flow (what happens)

- **Write commits using Conventional Commits** (examples):
  - `feat: ...` → minor release
  - `fix: ...` → patch release
  - `docs: ...` / `chore: ...` → patch release (configured in `.releaserc.json`)
- **Merge/push to `main`**:
  - GitHub Actions runs `npm ci`, then `npm run release`.
  - semantic-release determines the next version, generates release notes, updates `CHANGELOG.md`, publishes to npm, and creates a GitHub release.

</details>
