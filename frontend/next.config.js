/** @type {import('next').NextConfig} */

 const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
 });


const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/inbreng',
        destination: '/#feedback',
        permanent: true,
      },
    ]
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

module.exports = withMDX(nextConfig);
