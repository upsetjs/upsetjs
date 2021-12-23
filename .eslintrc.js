const pkg = require('./package.json');

module.exports = {
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
};
