export const seo = {
  title: 'home | zhw',
  ogTitle: 'blog',
  description: '我是zhw,欢迎来到我的博客',
  word: '沉淀',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://blog-rbtb.vercel.app/'
      : 'http://localhost:3000',
  ),
} as const;

export const siteUrl = new URL(
  process.env.NODE_ENV === 'production' ? 'https://blog-rbtb.vercel.app/' : 'http://localhost:3000',
);
