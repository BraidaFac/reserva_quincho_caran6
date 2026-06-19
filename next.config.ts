import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
};

export default withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
