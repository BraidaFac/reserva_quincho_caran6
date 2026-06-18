import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
