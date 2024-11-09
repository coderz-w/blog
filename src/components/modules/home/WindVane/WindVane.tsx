'use client';

import { m } from 'framer-motion';
import { createElement } from 'react';

import {
  FaSolidFeatherAlt,
  FaSolidUserFriends,
  MdiFlask,
  RMixPlanet,
} from '@/components/icons/menu-collection';

const windsock = [
  {
    title: '文稿',
    type: 'Note',
    path: '/list',
    icon: FaSolidFeatherAlt,
  },
  {
    title: '朋友们',
    icon: FaSolidUserFriends,
    path: '/friends',
  },
  {
    title: '看看我做些啥',
    icon: MdiFlask,
    path: '/projects',
  },
  {
    title: '跃迁',
    icon: RMixPlanet,
    path: 'https://travel.moe/go.html',
  },
];

export const WindVane = () => {
  return (
    <div className=" w-full mt-14 md:mt-20 flex flex-col gap-y-8 px-4">
      <span className="text-2xl flex justify-center items-center gap-x-2 text-center font-medium leading-loose font-mono ">
        风向标
        <span className=" i-mingcute-navigation-line cursor-pointer hover:rotate-[360deg] animate-ease-out duration-200" />
      </span>
      <div className=" center flex">
        <ul className=" flex flex-col flex-wrap gap-2 gap-y-10 opacity-80 lg:flex-row">
          {windsock.map((item, index) => {
            return (
              <m.li
                initial={{ opacity: 0.0001, y: 15 }}
                viewport={{ once: true }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    stiffness: 641,
                    damping: 23,
                    mass: 3.9,
                    type: 'spring',
                    delay: index * 0.05,
                  },
                }}
                transition={{
                  delay: 0.001,
                }}
                whileHover={{
                  y: -6,
                  transition: {
                    stiffness: 641,
                    damping: 23,
                    mass: 4.9,
                    type: 'spring',
                  },
                }}
                key={index}
                className="flex items-center justify-between text-sm group"
              >
                <a
                  href={item.path}
                  className="flex items-center gap-4 text-neutral-800 duration-200 hover:!text-accent dark:text-neutral-200 group-hover:text-[var(--accent-color)]"
                >
                  {createElement(item.icon, {
                    className: 'w-6 h-6 group-hover:text-[var(--accent-color)]',
                  })}
                  <span className=" group-hover:text-[var(--accent-color)]">{item.title}</span>
                </a>

                {index != windsock.length - 1 && (
                  <span className="mx-4 hidden select-none lg:inline"> · </span>
                )}
              </m.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
