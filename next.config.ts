import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/RoboNex" : "",
  assetPrefix: isProd ? "/RoboNex/" : "",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/RoboNex" : "",
  },
};

export default nextConfig;
