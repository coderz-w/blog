import React from 'react';
import { Metadata } from 'next';

import AnimatedPostItem from './AnimatedPostItem';

import { NormalContainer } from '@/components/layout/container/Normal';
import { getPostData } from '@/core';
import { getUserLocale } from '@/lib/getLocale';
import localeValues from '@/locale';

export const metadata: Metadata = {
  title: '文稿',
  description: '文章列表',
};

const ArticleList: React.FC = async () => {
  const { postDataList } = await getPostData();
  const lang = getUserLocale();
  const listLocale = localeValues[lang].list;

  return (
    <NormalContainer>
      <ul>
        {postDataList.map((item, index) => (
          <AnimatedPostItem locale={listLocale} key={item.path} item={item} index={index} />
        ))}
      </ul>
    </NormalContainer>
  );
};

export default ArticleList;
