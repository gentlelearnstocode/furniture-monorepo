/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Cache optimized images for 1 year (reduces Blob data transfer)
    minimumCacheTTL: 31536000,
    // Use modern, smaller formats
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
