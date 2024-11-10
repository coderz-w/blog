export const seo = {
  title: 'zhw | fe',
  description: '我是zhw,欢迎来到我的博客',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://blog-rbtb.vercel.app/'
      : 'http://localhost:3000',
  ),
} as const;
