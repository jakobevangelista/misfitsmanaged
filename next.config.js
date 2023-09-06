/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    appDir: true,
  },
  images: {
    domains: ["cdn.shopify.com", "utfs.io"],
  },
};

module.exports = nextConfig;
