'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { cn } from '@/lib/helper';
import type { PostItem as PostItemType } from '@/core';
import dayjs from '@/lib/dayjs';

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: PostItemType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const router = useRouter();
    const postLink = `/notes/${card.path}`;

    return (
      <div
        onClick={useCallback(() => {
          router.push(postLink);
        }, [])}
        className={cn(
          'rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out cursor-pointer',
          hovered !== null && hovered !== index && 'blur-sm scale-[0.98]',
        )}
      >
        <Image
          src={card.coverImage}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover absolute inset-0"
        />
        <div
          className={cn(
            'absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-4 transition-opacity duration-300',
            hovered === index ? 'opacity-100' : 'opacity-60',
          )}
        >
          <div
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className=" w-full flex flex-col gap-y-1 -my-4"
          >
            <div className=" w-full text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 mb-2">
              {card.title}
            </div>
            <div className="text-sm text-neutral-300 flex flex-nowrap gap-x-4">
              <div className=" flex items-center justify-start gap-x-1">
                <i className=" i-material-symbols-calendar-clock-outline-sharp text-lg"></i>
                <span>
                  {card.createdAt
                    ? dayjs(card.createdAt).format('YYYY 年 M 月 D 日')
                    : '1999 年 9 月 9 日'}
                </span>
              </div>
              <div className=" flex items-center justify-start gap-x-1">
                <i className=" i-material-symbols-edit text-lg"></i>
                <span>{card.tag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export function FocusCards({ postCards }: { postCards: PostItemType[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 max-w-[7xl] mx-auto md:px-8 w-full">
      {postCards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
