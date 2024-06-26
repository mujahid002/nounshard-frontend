/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "noun.pics",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
