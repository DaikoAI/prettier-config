import test from "node:test";
import assert from "node:assert/strict";
import prettier from "prettier";

import config from "../dist/index.mjs";

function unwrapDefault(mod) {
  return mod && typeof mod === "object" && "default" in mod ? mod.default : mod;
}

test("exports a stable prettier config object", () => {
  assert.equal(config.printWidth, 120);
  assert.equal(config.arrowParens, "avoid");
  assert.equal(config.useTabs, false);
  assert.equal(config.tabWidth, 2);
  assert.equal(config.singleQuote, false);
  assert.equal(config.bracketSpacing, true);
  assert.equal(config.bracketSameLine, false);
  assert.equal(config.experimentalTernaries, true);

  assert.deepEqual(config.plugins, ["prettier-plugin-organize-imports", "@prettier/plugin-oxc"]);
});

test("prettier options are applied (indent, quotes, bracketSpacing, arrowParens)", async () => {
  const input = "const f = (x) => {return {a:1, b:'x'}}\nfunction g(){\nconsole.log(1)\n}\n";

  const formatted = await prettier.format(input, {
    ...config,
    parser: "babel",
  });

  // arrowParens: avoid
  assert.match(formatted, /const f = x =>/);
  // bracketSpacing: true
  assert.match(formatted, /\{ a: 1, b: "x" \}/);
  // singleQuote: false
  assert.ok(!formatted.includes("'x'"));
  assert.ok(formatted.includes('"x"'));
  // useTabs: false, tabWidth: 2
  assert.match(formatted, /\n  console\.log\(1\);\n/);
});

test("bundled plugins can be imported", async () => {
  const organizeImports = unwrapDefault(await import("prettier-plugin-organize-imports"));
  const oxc = unwrapDefault(await import("@prettier/plugin-oxc"));

  assert.ok(organizeImports, "prettier-plugin-organize-imports should be importable");
  assert.ok(oxc, "@prettier/plugin-oxc should be importable");
});

test("prettier-plugin-organize-imports actually organizes imports", async () => {
  const organizeImports = unwrapDefault(await import("prettier-plugin-organize-imports"));

  const input = [
    'import { b } from "./b";\n',
    'import { a } from "./a";\n',
    "export const x = a + b;\n",
  ].join("");

  const formatted = await prettier.format(input, {
    ...config,
    // Ensure plugin resolution does not depend on external node_modules lookup.
    plugins: [organizeImports],
    parser: "typescript",
    filepath: "test.ts",
  });

  const aIndex = formatted.indexOf('from "./a"');
  const bIndex = formatted.indexOf('from "./b"');
  assert.ok(aIndex !== -1 && bIndex !== -1, "formatted output should keep both imports");
  assert.ok(aIndex < bIndex, "imports should be organized in a stable order");
});

test("plugins listed as strings in this config are resolvable by prettier (organize imports)", async () => {
  const input = [
    'import { b } from "./b";\n',
    'import { a } from "./a";\n',
    "export const x = a + b;\n",
  ].join("");

  const formatted = await prettier.format(input, {
    ...config,
    // Use the config exactly as consumers do: plugins are strings.
    parser: "typescript",
    filepath: "test.ts",
  });

  const aIndex = formatted.indexOf('from "./a"');
  const bIndex = formatted.indexOf('from "./b"');
  assert.ok(aIndex !== -1 && bIndex !== -1, "formatted output should keep both imports");
  assert.ok(aIndex < bIndex, "imports should be organized in a stable order (via string plugins)");
});

test("@prettier/plugin-oxc provides a usable parser", async () => {
  const oxc = unwrapDefault(await import("@prettier/plugin-oxc"));

  const parsers = oxc?.parsers && typeof oxc.parsers === "object" ? Object.keys(oxc.parsers) : [];
  assert.ok(parsers.length > 0, "@prettier/plugin-oxc should export at least one parser");

  const parser = parsers[0];
  const formatted = await prettier.format("const x={a:1};\n", {
    ...config,
    plugins: [oxc],
    parser,
  });

  // bracketSpacing: true should still apply
  assert.match(formatted, /\{ a: 1 \}/);
});

test("plugins listed as strings in this config are resolvable by prettier (oxc parser)", async () => {
  const oxc = unwrapDefault(await import("@prettier/plugin-oxc"));
  const parsers = oxc?.parsers && typeof oxc.parsers === "object" ? Object.keys(oxc.parsers) : [];
  assert.ok(parsers.length > 0, "@prettier/plugin-oxc should export at least one parser");

  // Pick a deterministic parser name so the test is stable across environments.
  const parser = parsers.includes("oxc") ? "oxc" : parsers.includes("oxc-ts") ? "oxc-ts" : parsers.sort()[0];

  const formatted = await prettier.format("const x={a:1};\n", {
    ...config,
    // Use the config exactly as consumers do: plugins are strings.
    parser,
  });

  assert.match(formatted, /\{ a: 1 \}/);
});
