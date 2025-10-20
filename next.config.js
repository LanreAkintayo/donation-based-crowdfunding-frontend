/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_API_SECRET_KEY: process.env.NEXT_PUBLIC_API_SECRET_KEY,
    NEXT_PUBLIC_IPFS_API_ENDPOINT: process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT,
    NEXT_PUBLIC_PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  },
  images: {
    domains: ['amethyst-intimate-swallow-509.mypinata.cloud'],
  },
};

module.exports = nextConfig;
