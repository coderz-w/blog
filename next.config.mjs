/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer';

let nextConfig = {
  images: {
    domains: ['innei.in'],
  },
};

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig);
}

export default nextConfig;
