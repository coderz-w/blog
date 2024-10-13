/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer'

let nextConfig = {};

nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig)

export default nextConfig;
