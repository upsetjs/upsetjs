module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [require.resolve('@storybook/addon-docs/preset')],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: require.resolve('react-docgen-typescript-loader'),
      options: {}, // your options here
    });
    return config;
  },
};
