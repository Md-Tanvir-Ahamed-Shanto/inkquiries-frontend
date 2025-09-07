/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:5000',
  },
};

export default nextConfig;

export const images = {
  domains: ['localhost', 'res.cloudinary.com'],
  path: '/_next/image',
  loader: 'default',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
