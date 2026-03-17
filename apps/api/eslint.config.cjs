"use strict";

const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["apps/api/eslint.config.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["apps/api/src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
      globals: { node: true },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  }
);

