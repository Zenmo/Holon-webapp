/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
