/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    trailingSlash: true,
    reactStrictMode: false,
    async rewrites() { 
        return [
            // 接口请求 前缀带上/api/
            // { source: '/api/:path*', destination: 'http://33.254.37.150:1234/:path*' }, 
            { source: '/api/:path*', destination: 'http://33.254.37.150:23435/:path*' },
            // { source: '/api/:path*', destination: 'https://mock.apifox.com/m1/3656268-0-default/:path*' }, 
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig
