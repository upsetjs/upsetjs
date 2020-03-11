const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');
const ts = require('@wessberg/rollup-plugin-ts');

module.exports = {
  rollup(config, options) {
    delete config.external; // bundle full
    delete config.output.globals;
    config.plugins.splice(
      0,
      0,
      alias({
        entries: [{ find: 'react', replacement: require.resolve('preact/compat/dist/compat.module.js') }],
      }),
      resolve(),
      commonjs()
    );
    config.plugins.splice(
      config.plugins.findIndex(d => d.name === 'rpt2'),
      1,
      ts({})
    );
    return config;
  },
};
