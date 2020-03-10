const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');
const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    delete config.external; // bundle full
    delete config.output.globals;
    config.plugins.splice(0, 0, resolve(), commonjs());
    config.plugins.push(
      copy({
        targets: [
          {
            src: 'src/index.html',
            dest: 'dist',
            transform: contents => contents.toString().replace('__SCRIPT__', `upsetjs.umd.${options.env}.js`),
          },
        ],
      })
    );
    return config;
  },
};
