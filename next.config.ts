import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Other package-lock.json files higher up the folder tree would make Next guess the wrong root.
  turbopack: { root: path.join(__dirname) },
  poweredByHeader: false,
};

export default nextConfig;
