/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer';
import withLess from 'next-with-less';

let nextConfig = {
  images: {
    domains: ['innei.in', 'images.unsplash.com', 'assets.aceternity.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 允许加载所有远程 HTTPS 主机的图片
      },
      {
        protocol: 'http',
        hostname: '**', // 允许加载所有远程 HTTP 主机的图片
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;
  },
};

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig);
}

export default withLess(nextConfig);
