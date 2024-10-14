export const seo = {
  title: 'zhw | fe',
  description: '我叫zhw。',
  url: new URL(
    process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000',
  ),
} as const;
