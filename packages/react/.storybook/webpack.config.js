const path = require('path');
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          reportFiles: ['src/**/*.stories.{ts|tsx}'],
        },
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
        options: {
          // Provide the path to your tsconfig.json so that your stories can
          // display types from outside each individual story.
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        },
      },
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = Object.assign(config.resolve.alias, { '@': path.resolve(__dirname, '..') });

  // pnp
  config.resolve.plugins = (config.resolve.plugins || []).concat([PnpWebpackPlugin]);
  config.resolveLoader = {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  };
  return config;
};
