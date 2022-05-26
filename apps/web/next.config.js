/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const urlMapping = {
    '/home': '/',
    '/contact_us': '/contact',
    '/controls_flight': '/teams/controls/flight_controls',
    '/controls_ground': '/teams/controls/ground_controls',
    '/structural_aero': '/teams/structural',
    '/sponsor': '/sponsors',
    '/recruit': '/recruitment',
}

const nextConfig = withBundleAnalyzer({
    reactStrictMode: true,
    pageExtensions: ['page.tsx', 'api.ts'],
    redirects: () => Object.entries(urlMapping).map(([source, destination]) => ({
        source,
        destination,
        permanent: false,
    })),
    rewrites: () => {
        return {
            afterFiles: [
                {
                    source: '/admin/:path*',
                    destination: `${process.env.PAYLOAD_INTERNAL_URL}/admin/:path*`,
                },
                {
                    source: '/api/:path*',
                    destination: `${process.env.PAYLOAD_INTERNAL_URL}/api/:path*`,
                },
            ],
            fallback: process.env.NODE_ENV === 'development' ? [
                {
                    source: '/:path*',
                    destination: `${process.env.PAYLOAD_INTERNAL_URL}/:path*`,
                },
            ] : undefined,
        }
    },
})

module.exports = nextConfig
