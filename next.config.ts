import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' to enable API routes on Cloudflare Pages
  // Cloudflare Pages will handle the deployment with @cloudflare/next-on-pages
};

export default nextConfig;
