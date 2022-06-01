/* eslint-env node */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['react-app', 'plugin:prettier/recommended', 'prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  settings: {
    react: {
      version: pkg.devDependencies.react ? 'detect' : '99.99.99',
    },
  },
  rules: {
    'no-continue': 'off',
    'react/require-default-props': 'off', // don't use in TypeScript
    'react/jsx-props-no-spreading': 'off', // shorthand passing of props
    'react/destructuring-assignment': 'off', // don't force destructuring
    'no-nested-ternary': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
