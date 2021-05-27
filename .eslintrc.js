const pkg = require('./package.json');

module.exports = {
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['react-app', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  settings: {
    react: {
      version: pkg.devDependencies.react ? 'detect' : '99.99.99',
    },
  },
};
