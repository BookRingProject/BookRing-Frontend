/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'bookring.onrender.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://bookring.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;