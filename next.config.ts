import type { NextConfig } from "next";

// basePath required for GitHub Pages subdirectory deployment.
// Set NEXT_PUBLIC_BASE_PATH="" in env when using a custom domain at root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
