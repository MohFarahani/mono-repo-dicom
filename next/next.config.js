/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `http://${backendHost}:4000/graphql`;
    
    return [
      {
        source: '/api/graphql',
        destination: backendUrl,
      },
      {
        source: '/api/process-dicom',
        destination: `http://${backendHost}:4000/process-dicom`,
      },
      {
        source: '/api/download',
        destination: `http://${backendHost}:4000/download`,
      },
    ];
  },
};

module.exports = nextConfig;