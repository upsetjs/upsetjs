const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.(ts|tsx)'],
  addons: [
    {
      name: require.resolve('@storybook/preset-typescript'),
      options: {
        include: [path.resolve(__dirname, '../src')],
      },
    },
    require.resolve('@storybook/addon-docs/preset'),
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: require.resolve('react-docgen-typescript-loader'),
      options: {}, // your options here
    });
    return config;
  },
};
