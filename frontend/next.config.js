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
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

module.exports = withMDX(nextConfig);
