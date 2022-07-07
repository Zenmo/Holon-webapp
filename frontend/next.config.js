/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    loader: 'imgix',
    path: 'https://holontool.nl',
    domains: ['holontool.nl']
  }
};

module.exports = nextConfig;
