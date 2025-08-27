import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/admin",
                permanent: true,
            },
        ];
    },
};

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);

export default nextConfig;
