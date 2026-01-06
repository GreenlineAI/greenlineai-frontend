module.exports = {
  root: true,
  env: { browser: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'next/core-web-vitals',
  ],
  ignorePatterns: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  rules: {
    'react/no-unescaped-entities': 'off',
  },
};
