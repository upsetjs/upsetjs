const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'UpSet.js App',
      template: path.resolve('./src/index.html'),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: { '@': path.resolve(__dirname) },
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};
