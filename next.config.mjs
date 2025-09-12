/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'cdn-icons-png.flaticon.com',
      'api.inkquiries.org',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.inkquiries.org',
  },
};

export default nextConfig;

export const images = {
  domains: ['localhost', 'res.cloudinary.com', 'cdn-icons-png.flaticon.com','http://api.inkquiries.org','https://api.inkquiries.org'],
  path: '/_next/image',
  loader: 'default',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
