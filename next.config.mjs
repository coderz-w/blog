/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer';

let nextConfig = {
  images: {
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
  // type: 'asset/source' 会让 Webpack 将文件内容直接作为字符串导出，而不是生成特定的资源文件路径。这种方式特别适用于将 Markdown、SVG、文本文件等直接导入为字符串内容的场景。
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      // use: 'raw-loader',
      type: 'asset/source',
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: '/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
      },
      {
        source: '/feed',
        destination: '/feed.xml',
      },
    ]
  },
  productionBrowserSourceMaps: true,
};

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig);
}

export default nextConfig;
