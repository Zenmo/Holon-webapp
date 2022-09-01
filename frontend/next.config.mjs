/** @type {import('next').NextConfig} */

import remarkGfm from "remark-gfm";
import remarkPrism from "remark-prism";

import configureMDX from "@next/mdx";

const withMDX = configureMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkPrism],
    providerImportSource: "@mdx-js/react",
  },
  extension: /\.mdx?$/,
});

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(nextConfig);
