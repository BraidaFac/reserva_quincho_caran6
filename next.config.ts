import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
};

export default nextConfig;
