import React from 'react';

import AnimatedPostItem from './AnimatedPostItem';

import { NormalContainer } from '@/components/layout/container/Normal';

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
          <AnimatedPostItem key={item.id} item={item} index={index} />
        ))}
      </ul>
    </NormalContainer>
  );
};

export default ArticleList;
