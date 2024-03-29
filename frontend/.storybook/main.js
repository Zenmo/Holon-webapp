const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  stories: [
    "../stories/**/*.stories.tsx",
    "../components/**/*.stories.tsx",
    "../containers/**/*.stories.tsx",
  ],
  core: {
    builder: "webpack5",
  },
  babel: async options => {
    options.presets = ["next/babel"];
    return {
      ...options,
    };
  },
  addons: [
    "@storybook/addon-viewport",
    "@storybook/addon-a11y",
    {
      name: "storybook-addon-next",
    },
    // Add PostCSS for Tailwind.
    {
      name: "@storybook/addon-postcss",
      options: {
        cssLoaderOptions: {
          // When you have splitted your css over multiple files
          // and use @import('./other-styles.css')
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require("postcss"),
        },
      },
    },
  ],
  features: {
    babelModeV7: true,
  },
  webpackFinal: async config => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        plugins: [new TsconfigPathsPlugin({})],
      },
    };
  },
};
