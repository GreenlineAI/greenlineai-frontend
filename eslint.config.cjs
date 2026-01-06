const { defineConfig } = require('eslint/config');

// Minimal flat configuration to avoid plugin resolution issues while we investigate
module.exports = defineConfig([
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
]);
