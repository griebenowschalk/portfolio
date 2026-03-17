import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function buildRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [
    // Microlink OG image previews
    { protocol: "https", hostname: "api.microlink.io" },
    // AWS CloudFront CDN (project/skill images from S3)
    { protocol: "https", hostname: "*.cloudfront.net" },
  ];

  // Allow localhost images in local dev
  if (process.env.NODE_ENV === "development") {
    patterns.push({ protocol: "http", hostname: "localhost" });
  }

  // Allow a specific CloudFront domain if set via env (optional extra safety)
  const cfUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  if (cfUrl) {
    try {
      const { hostname } = new URL(cfUrl);
      if (!patterns.some((p) => p.hostname === hostname)) {
        patterns.push({ protocol: "https", hostname });
      }
    } catch {
      // invalid URL — ignore
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

export default nextConfig;
