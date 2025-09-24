// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["example.com", "res.cloudinary.com", "images.unsplash.com"], // ✅ Add the image domain here
  },
};

export default nextConfig;
