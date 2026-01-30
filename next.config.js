/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'], // Example, usually not needed for prisma
    // experimental: {
    //     // serverComponentsExternalPackages is moved to top level in newer versions but let's try both locations for safety
    //     serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    // },
    // Also add top level for latest Next.js 15+
    serverExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;
