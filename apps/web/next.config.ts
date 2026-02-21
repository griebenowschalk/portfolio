import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const localImages = () => {
  return process.env.NODE_ENV === "development"
    ? [
        {
          protocol: "http",
          hostname: "localhost",
        },
      ]
    : [];
};
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      ...(localImages() as RemotePattern[]),
    ],
  },
};

export default nextConfig;
