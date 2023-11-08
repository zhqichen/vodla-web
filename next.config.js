/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    // async rewrites() { 
    //     return [ 
    //         // 接口请求 前缀带上/api/
    //         { source: '/api/:path*', destination: `http://11.160.41.98:3467/:path*` }, 
    //     ]
    // },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig
