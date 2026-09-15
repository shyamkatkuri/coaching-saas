import type { NextConfig } from "next";
const path = require('path');

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Moves up two levels from /apps/public-web to the monorepo root
    root: path.join(__dirname, '../../'), 
  },
};

export default nextConfig;
