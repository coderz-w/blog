import React from 'react';

import {
  FaSolidComments,
  FaSolidDotCircle,
  FaSolidFeatherAlt,
  FaSolidUserFriends,
  MdiFlask,
} from '@/components/icons/menu-collection';

export interface IHeaderMenu {
  title: string;
  path: string;
  type?: string;
  icon?: React.ReactNode;
  subMenu?: IHeaderMenu[];
}

export const headerMenuConfig: IHeaderMenu[] = [
  {
    title: '首页',
    path: '/',
    type: 'Home',
    icon: React.createElement(FaSolidDotCircle),
    subMenu: [],
  },
  {
    title: '文稿',
    type: 'Note',
    path: '/list',
    icon: React.createElement(FaSolidFeatherAlt),
  },
  {
    title: '友链',
    icon: React.createElement(FaSolidUserFriends),
    path: '/friends',
  },
  {
    title: '项目',
    icon: React.createElement(MdiFlask),
    path: '/projects',
  },
  {
    title: '自述',
    path: '/about',
    icon: React.createElement(FaSolidComments),
  },
];
