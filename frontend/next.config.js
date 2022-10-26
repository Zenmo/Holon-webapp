const basePath = "";

let nextConfig = {
  webpack: true,
  reactStrictMode: true,
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  basePath,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    domains: ["localhost", "holontool.nl"],
  },
  async rewrites() {
    return [
      {
        source: "/wt/static/:path*",
        destination: "http://localhost:8000/wt/static/:path*", // Proxy to Backend
      },
    ];
  },
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

module.exports = withSvgr(nextConfig);
