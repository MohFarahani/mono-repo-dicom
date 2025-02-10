/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost';
    return [
      {
        source: '/api/graphql',
        destination: `http://${backendHost}:4000/graphql`,
      },
      {
        source: '/api/process-dicom',
        destination: `http://${backendHost}:4000/process-dicom`,
      },
    ];
  },
};

module.exports = nextConfig; 