const path = require('path');
const pkg = require('./package.json');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const babel = {
  loader: require.resolve('babel-loader'),
  options: {
    cacheDirectory: true,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: pkg.browserslist,
          useBuiltIns: 'entry',
          corejs: pkg.dependencies['core-js'],
        },
      ],
    ],
  },
};

module.exports = function (env, argv) {
  const p = (env && env.production) || argv.p;
  return {
    entry: {
      app: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `[name].js`,
      chunkFilename: '[chunkhash].js',
      publicPath: '', //no public path = relative
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            babel,
            {
              loader: require.resolve('ts-loader'),
            },
          ],
        },
        {
          test: /\.js?$/,
          use: [babel],
        },
        {
          test: /\.(png|jpg|gif|jpeg)$/,
          loader: 'url-loader',
          options: {
            limit: 20000, //inline <= 20kb
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'UpSet.js App',
        template: path.resolve('./src/index.html'),
      }),
      p &&
        new WorkboxPlugin.GenerateSW({
          // these options encourage the ServiceWorkers to get in there fast
          // and not allow any straggling "old" SWs to hang around
          clientsClaim: true,
          skipWaiting: true,
        }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: { '@': path.resolve(__dirname) },
      plugins: [PnpWebpackPlugin],
      symlinks: false,
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
  };
};
