# @daikolabs/prettier-config

Daiko Labs の共通 Prettier 設定（shareable config）です。

公式の作り方は Prettier ドキュメントの [Sharing configurations](https://prettier.io/docs/sharing-configurations) を参照してください。

## Install

このパッケージは shareable config のみを提供します。plugins / prettier は利用側（consumer）でインストールしてください。

```bash
npm i -D @daikolabs/prettier-config prettier prettier-plugin-organize-imports @prettier/plugin-oxc
```

## Usage

`package.json` に設定します。

```json
{
  "prettier": "@daikolabs/prettier-config"
}
```

## Extending (上書き)

利用側で一部だけ上書きしたい場合は `.prettierrc.mjs` を作り、import して spread します。

```js
import base from "@daikolabs/prettier-config";

/** @type {import("prettier").Config} */
export default {
  ...base,
  // 例: プロジェクトごとに変更したい設定があればここで上書き
  // semi: false,
};
```

## Development (TSで管理)

設定は `index.ts` で管理し、publish時に `tsc` で `dist/index.js` を生成します（Prettierが読むのは `dist/index.js`）。

```bash
npm run build
```

## CIで自動publish（GitHub Actions）

このリポジトリは Changesets を使って、`main` へのpush時に「Release PR作成」または「npm publish」を自動実行します。

- npm publish するには GitHub の Repository Secrets に **`NPM_TOKEN`** を設定してください。
- 変更をpublish対象にするには changeset を追加します:

```bash
npm run changeset
```
