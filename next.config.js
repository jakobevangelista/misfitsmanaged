/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "cdn.shopify.com",
      "utfs.io",
      "i0.wp.com",
      "assets.roguefitness.com",
      "m.media-amazon.com",
      "static1.squarespace.com",
    ],
  },
};

module.exports = nextConfig;
