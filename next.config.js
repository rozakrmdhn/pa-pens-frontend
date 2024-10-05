/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for catching potential issues in React code
    reactStrictMode: true,
    
    // Environment variables for use in the browser and server-side code
    env: {
        API_HOST: process.env.API_HOST,
    },
};

module.exports = nextConfig
