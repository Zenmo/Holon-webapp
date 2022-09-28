import withPlugins from "next-compose-plugins";

const basePath = "";

let nextConfig = {
  webpack5: true,
  reactStrictMode: true,
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  basePath,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withSvgr = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: "@svgr/webpack", options: { ref: true } }],
      });
      return config;
    },
  });
};

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });

export default withPlugins(
  [
    withSvgr,
    //withBundleAnalyzer,
  ],
  nextConfig
);
