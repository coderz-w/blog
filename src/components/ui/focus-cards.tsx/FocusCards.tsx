'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/lib/helper';

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out cursor-pointer',
        hovered !== null && hovered !== index && 'blur-sm scale-[0.98]',
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover absolute inset-0"
      />
      <div
        className={cn(
          'absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-4 transition-opacity duration-300', // 修改为 flex-col
          hovered === index ? 'opacity-100' : 'opacity-60',
        )}
      >
        {/* 标题 */}
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 mb-2">
          {card.title}
        </div>
        {/* 日期 */}
        <div className="text-sm text-neutral-300 flex flex-nowrap gap-x-4">
          <div className=" flex items-center justify-start gap-x-1">
            <i className=" i-material-symbols-calendar-clock-outline-sharp text-lg"></i>
            <span>2024/06/24</span>
          </div>
          <div className=" flex items-center justify-start gap-x-1">
            <i className=" i-material-symbols-edit text-lg"></i>
            <span>随笔</span>
          </div>
        </div>
      </div>
    </div>
  ),
);

Card.displayName = 'Card';

type Card = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 max-w-[7xl] mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
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
