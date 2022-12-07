const { removeWebpackPlugin } = require('@rescripts/utilities');

module.exports = [
  (config) => {
    config.resolve = removeWebpackPlugin('ModuleScopePlugin', config.resolve);
    return config;
  },
];
