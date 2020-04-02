const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');

module.exports = {
  rollup(config) {
    config.plugins.splice(0, 0, resolve(), commonjs());
    return config;
  },
};
