/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    transpilePackages: ['lucide-react'],
    serverExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
