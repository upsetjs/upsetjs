const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');

module.exports = {
  rollup(config) {
    const c = config.plugins.findIndex((d) => d.name === 'commonjs');
    if (c !== -1) {
      config.plugins.splice(c, 1);
    }
    config.plugins.splice(0, 0, resolve(), commonjs());
    config.plugins = config.plugins.filter((d) => d !== false);
    return config;
  },
};
