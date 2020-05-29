const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');
const cleanup = require('rollup-plugin-cleanup');

module.exports = {
  rollup(config) {
    delete config.external; // bundle full
    delete config.output.globals;
    const c = config.plugins.findIndex((d) => d.name === 'commonjs');
    if (c !== -1) {
      config.plugins.splice(c, 1);
    }
    config.plugins.splice(
      0,
      0,
      alias({
        entries: [{ find: 'react', replacement: require.resolve('preact/compat/dist/compat.module.js') }],
      }),
      resolve(),
      commonjs()
    );
    config.plugins.push(
      cleanup({
        comments: ['some', 'ts', 'ts3s'],
        extensions: ['ts', 'tsx', 'js', 'jsx'],
      })
    );
    config.plugins = config.plugins.filter((d) => d !== false);
    config.output.banner = `/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */`;
    return config;
  },
};
