/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["cdn.shopify.com", "utfs.io"],
  },
};

module.exports = nextConfig;
