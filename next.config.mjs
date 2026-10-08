/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // allowedDevOrigins: ['http://localhost:3000', '127.0.0.1:3000'],
    basePath: `/${process.env.NEXT_PUBLIC_BASE_PATH}`,
};

export default nextConfig;
