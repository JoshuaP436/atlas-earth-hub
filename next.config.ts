/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove turbopack configuration as it's causing issues
  async redirects() {
    return [
      {
        source: '/auth/signup',
        destination: '/auth/signin',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;