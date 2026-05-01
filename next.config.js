/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC for Vercel (better performance)
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'bookring.onrender.com'],
  },
};

module.exports = nextConfig;
