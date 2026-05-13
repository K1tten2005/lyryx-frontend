/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.genius.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.rapgenius.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.embed.ly',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
