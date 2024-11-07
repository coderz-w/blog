'use client';

import React from 'react';
import { m } from 'framer-motion';

import { NormalContainer } from '@/components/layout/container/Normal';
import { PostItem } from '@/components/modules/list/PostItem';

// 假数据
const mockData = [
  { id: 1, title: '文章标题 1', content: '这是文章内容 1' },
  { id: 2, title: '文章标题 2', content: '这是文章内容 2' },
  { id: 3, title: '文章标题 3', content: '这是文章内容 3' },
  { id: 12, title: '文章标题 1', content: '这是文章内容 1' },
  { id: 22, title: '文章标题 2', content: '这是文章内容 2' },
  { id: 32, title: '文章标题 3', content: '这是文章内容 3' },

  // 更多假数据
];

const ArticleList: React.FC = () => {
  return (
    <NormalContainer>
      <ul>
        {mockData.map((item, index) => (
          <m.li
            initial={{ y: 50, opacity: 0.01 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                delay: index * 0.1,
                type: 'spring',
                damping: 10,
                stiffness: 100,
              },
            }}
            key={item.id}
          >
            <PostItem data={item} />
          </m.li>
        ))}
      </ul>
    </NormalContainer>
  );
};

export default ArticleList;
