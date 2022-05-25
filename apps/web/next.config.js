/** @type {import('next').NextConfig} */

const urlMapping = {
    '/home': '/',
    '/contact_us': '/contact',
    '/controls_flight': '/teams/controls/flight_controls',
    '/controls_ground': '/teams/controls/ground_controls',
    '/structural_aero': '/teams/structural',
    '/sponsor': '/sponsors',
    '/recruit': '/recruitment',
}

const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['page.tsx', 'api.ts'],
    redirects: () => Object.entries(urlMapping).map(([source, destination]) => ({
        source,
        destination,
        permanent: false,
    })),
}

module.exports = nextConfig
