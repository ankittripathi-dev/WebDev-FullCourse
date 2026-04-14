/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // use https because your URL starts with https
        hostname: "live.staticflickr.com",
        port:""
      },
    ],
  },
};

export default nextConfig;
