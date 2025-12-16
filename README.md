# @daikolabs/prettier-config

Daiko Labs shared Prettier configuration (shareable config).

For the official approach, see Prettier docs: [Sharing configurations](https://prettier.io/docs/sharing-configurations).

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

## Development (TypeScript source)

The config is maintained in `index.ts`. On publish, we build `dist/index.js` (Prettier reads `dist/index.js`).

```bash
npm run build
```

## Auto publishing in CI (GitHub Actions)

This repository uses semantic-release to **automatically version and publish to npm** on pushes to `main` (commit messages must follow Conventional Commits).

### Required environment variables (GitHub Actions)

The workflow passes these environment variables to semantic-release:

- **`GITHUB_TOKEN`**: provided automatically by GitHub Actions (`secrets.GITHUB_TOKEN`).
  - Used to create GitHub releases / comments, and to push release commits (e.g. changelog).
- **`NPM_TOKEN`**: must be configured in GitHub Repository Secrets.
  - Used by `@semantic-release/npm` to publish to npm.

Note: the workflow also sets `NODE_AUTH_TOKEN` to the same value as `NPM_TOKEN` for npm CLI compatibility. You only need to manage **one** secret (`NPM_TOKEN`).

### One-time setup steps

- **npm**:
  - Create an automation token (or access token) that has permission to publish the package.
  - Add it to GitHub Repository Secrets as **`NPM_TOKEN`**.
- **GitHub**:
  - Ensure the Actions workflow has permissions to write to contents (this repo’s `release.yml` requests `contents: write`).
  - Protect `main` as you like, but note releases run on push to `main`.

### Release flow (what happens)

- **Write commits using Conventional Commits** (examples):
  - `feat: ...` → minor release
  - `fix: ...` → patch release
  - `docs: ...` / `chore: ...` → patch release (configured in `.releaserc.json`)
- **Merge/push to `main`**:
  - GitHub Actions runs `npm install`, then `npm run release`.
  - semantic-release determines the next version, generates release notes, updates `CHANGELOG.md`, publishes to npm, and creates a GitHub release.
