const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');

module.exports = {
  rollup(config, options) {
    // const bak = config.external;
    // config.external = (id) => {
    //   console.log(id);
    //   if (id.includes('@upsetjs/bundle')) {
    //     return false;
    //   }
    //   return bak(id);
    // };
    config.output.globals.vue = 'Vue';
    config.plugins.splice(0, 0, resolve(), commonjs());
    return config;
  },
};
