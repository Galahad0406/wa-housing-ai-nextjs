/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  },
  // Optimize for production
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
