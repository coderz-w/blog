/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer';

let nextConfig = {
  images: {
    domains: ['innei.in','images.unsplash.com','assets.aceternity.com'],
  },
};

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig);
}

export default nextConfig;
