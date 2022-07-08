/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  i18n: {
    locales: ["nl"],
    defaultLocale: "nl",
  },
};

module.exports = nextConfig;
