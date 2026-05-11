// ESLint 9 flat config — Vertex Network spec §2.
// Pulls Next's bundled core-web-vitals + typescript rules and adds prettier
// as a non-conflict shim.

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "extension/**",
      "out/**",
      "coverage/**",
      "*.tsbuildinfo",
      "temp/**",
    ],
  },
];

export default eslintConfig;
