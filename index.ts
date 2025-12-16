import type { Config } from "prettier";

const config: Config = {
  printWidth: 120,
  arrowParens: "avoid",
  useTabs: false, // default is false
  tabWidth: 2, // default is 2
  singleQuote: false, // default is false
  bracketSpacing: true, // default is true
  bracketSameLine: false, // default is false
  experimentalTernaries: true, // default is false
  plugins: ["prettier-plugin-organize-imports", "@prettier/plugin-oxc"],
};

export default config;
