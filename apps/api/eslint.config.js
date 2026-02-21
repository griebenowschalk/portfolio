"use strict";

const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["*.config.js", "eslint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: true,
      },
      globals: { node: true },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  }
);
