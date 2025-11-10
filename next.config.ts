import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ksgytqsezmvybdzcnxne.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/courses-thumbnails/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dsed4bxit/image/upload/**",
        search: "",
      },
    ],
  }
};


export default nextConfig;
