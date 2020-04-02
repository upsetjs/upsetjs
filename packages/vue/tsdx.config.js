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
    const c = config.plugins.findIndex((d) => d.name === 'commonjs');
    if (c !== -1) {
      config.plugins.splice(c, 1);
    }
    config.plugins.splice(0, 0, resolve(), commonjs());
    config.plugins = config.plugins.filter((d) => d !== false);
    return config;
  },
};
