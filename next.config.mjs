/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const nextConfig = {
  strictMode: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  // assetPrefix: isProd ? null : `http://${internalHost}:4000`,
};

export default nextConfig;
