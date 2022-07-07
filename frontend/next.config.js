/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    loader: 'imgix',
    path: 'https://holontool.nl',
    domains: ['holontool.nl']
  }
};

module.exports = nextConfig;
