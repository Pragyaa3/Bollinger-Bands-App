/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // your other settings
  experimental: {
    turbo: {}, // disable turbo if needed
  },
};

module.exports = nextConfig;
