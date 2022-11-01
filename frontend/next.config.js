const basePath = "";

let nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output: "standalone",
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
      {
        source: `${process.env.NEXT_PUBLIC_WAGTAIL_API_URL}/:path*`,
        destination: `http://localhost:8000/${process.env.NEXT_PUBLIC_WAGTAIL_API_URL}/:path*/`, // Proxy to Backend
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
