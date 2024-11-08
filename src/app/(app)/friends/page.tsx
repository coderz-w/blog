'use client';

import { m } from 'framer-motion';
import { memo, useState } from 'react';
import Image from 'next/image';

import { friendsList, type FriendModel } from '~/index';

export default function Friends() {
  return (
    <div>
      <header className="prose prose-p:my-2 font-mono">
        <h2>朋友们</h2>
        <h3>海内存知己，天涯若比邻</h3>
      </header>

      <main className="mt-10 flex w-full flex-col">
        <FriendCardList data={friendsList} />
      </main>
    </div>
  );
}

const FriendCardList = ({ data }: { data: FriendModel[] }) => (
  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
    {data.map((friendModel) => {
      return <FriendCard key={friendModel.url} friendModel={friendModel} />;
    })}
  </div>
);

const FriendCard = ({ friendModel }: { friendModel: FriendModel }) => {
  const [enter, setEnter] = useState(false);

  return (
    <m.div
      role="link"
      aria-label={`Go to ${friendModel.name}'s website`}
      className="relative flex flex-col items-center justify-center cursor-pointer"
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
      onClick={() => window.open(friendModel.url, '_blank')}
      rel="noreferrer"
    >
      {enter && <LayoutBg />}
      <Image
        src={friendModel.avatar}
        height={64}
        width={64}
        alt={`Avatar of ${friendModel.name}`}
        className=" rounded-md"
      />
      <span className="flex h-full flex-col items-center justify-center space-y-2 py-3">
        <span className="text-lg font-medium">{friendModel.name}</span>
        <span className="line-clamp-2 text-balance break-all text-center text-sm text-base-content/80">
          {friendModel.desc}
        </span>
      </span>
    </m.div>
  );
};
const LayoutBg = memo(() => {
  return (
    <m.span
      layoutId="bg"
      className="absolute -inset-2 z-[-1] rounded-md bg-slate-200/80 dark:bg-neutral-600/80 pointer-events-none"
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.2 } }}
    />
  );
});
