import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise le hot-reload via les URLs de prévisualisation (sandbox Arena).
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
