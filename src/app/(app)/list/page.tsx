import React from 'react';

import AnimatedPostItem from './AnimatedPostItem';

import { NormalContainer } from '@/components/layout/container/Normal';
import { buildPostData } from '@/core';

const ArticleList: React.FC = () => {
  const { postDataList } = buildPostData();

  return (
    <NormalContainer>
      <ul>
        {postDataList.map((item, index) => (
          <AnimatedPostItem key={item.path} item={item} index={index} />
        ))}
      </ul>
    </NormalContainer>
  );
};

export default ArticleList;
