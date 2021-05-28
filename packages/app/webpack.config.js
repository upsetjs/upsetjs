const path = require('path');
const pkg = require('./package.json');
const DefinePlugin = require('webpack').DefinePlugin;
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

// see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InlineChunkHtmlPlugin.js#L10-L60
class InlineChunkHtmlPlugin {
  constructor(htmlWebpackPlugin, tests) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.tests = tests;
  }

  getInlinedTag(publicPath, assets, tag) {
    if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
      return tag;
    }
    const scriptName = publicPath ? tag.attributes.src.replace(publicPath, '') : tag.attributes.src;
    if (!this.tests.some((test) => scriptName.match(test))) {
      return tag;
    }
    const asset = assets[scriptName];
    if (asset == null) {
      return tag;
    }
    return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', (compilation) => {
      const tagFunction = (tag) => this.getInlinedTag(publicPath, compilation.assets, tag);

      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', (assets) => {
        assets.headTags = assets.headTags.map(tagFunction);
        assets.bodyTags = assets.bodyTags.map(tagFunction);
      });

      // Still emit the runtime chunk for users who do not use our generated
      // index.html file.
      // hooks.afterEmit.tap('InlineChunkHtmlPlugin', () => {
      //   Object.keys(compilation.assets).forEach(assetName => {
      //     if (this.tests.some(test => assetName.match(test))) {
      //       delete compilation.assets[assetName];
      //     }
      //   });
      // });
    });
  }
}

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
  const p = (env && env.production) || argv.mode === 'production';
  return {
    entry: {
      app: './src/index.tsx',
      embed: './src/embed.ts',
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
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
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
      new DefinePlugin({
        __VERSION__: JSON.stringify(pkg.version),
        // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new HtmlWebpackPlugin({
        title: 'UpSet.js App',
        template: path.resolve('./src/index.html'),
        excludeChunks: ['embed'],
      }),
      new HtmlWebpackPlugin({
        title: 'UpSet.js Embedded App',
        filename: 'embed.html',
        template: path.resolve('./src/index.html'),
        inject: 'body',
        chunks: ['embed'],
        inlineSource: '.(js|css)$', // embed all javascript and css inline
      }),
      p && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/embed/]),
      p &&
        new WorkboxPlugin.GenerateSW({
          // these options encourage the ServiceWorkers to get in there fast
          // and not allow any straggling "old" SWs to hang around
          clientsClaim: true,
          skipWaiting: true,
          excludeChunks: ['embed'],
        }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['module', 'browser', 'main'],
      alias: { '@': path.resolve(__dirname) },
      plugins: [PnpWebpackPlugin],
      symlinks: false,
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
  };
};
