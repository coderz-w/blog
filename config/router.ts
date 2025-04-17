import React from 'react';

import {
  FaSolidComments,
  FaSolidDotCircle,
  FaSolidFeatherAlt,
  FaSolidUserFriends,
  MdiFlask,
} from '@/components/icons/menu-collection';
import { getUserLocale } from '@/lib/getLocale';

export interface IHeaderMenu {
  title: string;
  path: string;
  type?: string;
  icon?: React.ReactNode;
  subMenu?: IHeaderMenu[];
}

const zhMenu: IHeaderMenu[] = [
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
    path: '/friends',
    icon: React.createElement(FaSolidUserFriends),
  },
  {
    title: '项目',
    path: '/projects',
    icon: React.createElement(MdiFlask),
  },
  {
    title: '自述',
    path: '/about',
    icon: React.createElement(FaSolidComments),
  },
];

const enMenu: IHeaderMenu[] = [
  {
    title: 'Home',
    path: '/',
    type: 'Home',
    icon: React.createElement(FaSolidDotCircle),
    subMenu: [],
  },
  {
    title: 'Notes',
    type: 'Note',
    path: '/list',
    icon: React.createElement(FaSolidFeatherAlt),
  },
  {
    title: 'Friends',
    path: '/friends',
    icon: React.createElement(FaSolidUserFriends),
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: React.createElement(MdiFlask),
  },
  {
    title: 'About',
    path: '/about',
    icon: React.createElement(FaSolidComments),
  },
];

export function headerMenuConfig(): IHeaderMenu[] {
  const locale = getUserLocale();

  return locale === 'en' ? enMenu : zhMenu;
}
