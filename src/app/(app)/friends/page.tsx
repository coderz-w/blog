'use client';

import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import Image from 'next/image';

interface FriendModel {
  name: string;
  url: string;
  avatar: string;
  desc: string;
}

export default function Friends() {
  const friendData: FriendModel[] = [
    {
      name: 'Alice',
      url: 'https://www.baidu.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'A passionate developer and a great friend.',
    },
    {
      name: 'Bob',
      url: 'https://bob.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Bob loves working on open-source projects.',
    },
    {
      name: 'Charlie',
      url: 'https://charlie.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Charlie is a fantastic designer and loves to create beautiful UIs.',
    },
    {
      name: 'Dave',
      url: 'https://dave.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'A data science enthusiast and machine learning expert.',
    },
    {
      name: 'Eve',
      url: 'https://eve.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Eve loves cybersecurity and cryptography.',
    },
    {
      name: 'Frank',
      url: 'https://frank.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Frank is a backend engineer with years of experience.',
    },
    {
      name: 'Grace',
      url: 'https://grace.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Grace is a machine learning researcher.',
    },
    {
      name: 'Heidi',
      url: 'https://heidi.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Heidi enjoys working on cloud computing.',
    },
    {
      name: 'Ivan',
      url: 'https://ivan.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Ivan specializes in database optimization.',
    },
    {
      name: 'Judy',
      url: 'https://judy.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Judy is a frontend developer with a passion for animations.',
    },
    {
      name: 'Karl',
      url: 'https://karl.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Karl is a mobile developer working on iOS apps.',
    },
    {
      name: 'Lara',
      url: 'https://lara.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Lara enjoys writing clean, maintainable code.',
    },
    {
      name: 'Mallory',
      url: 'https://mallory.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Mallory is an expert in penetration testing.',
    },
    {
      name: 'Nina',
      url: 'https://nina.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Nina is passionate about AR/VR development.',
    },
    {
      name: 'Oscar',
      url: 'https://oscar.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Oscar loves contributing to open-source projects.',
    },
    {
      name: 'Peggy',
      url: 'https://peggy.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Peggy is a blockchain developer.',
    },
    {
      name: 'Quinn',
      url: 'https://quinn.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Quinn focuses on DevOps and cloud infrastructure.',
    },
    {
      name: 'Rita',
      url: 'https://rita.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Rita is an AI researcher and educator.',
    },
    {
      name: 'Steve',
      url: 'https://steve.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Steve enjoys developing Android applications.',
    },
    {
      name: 'Trudy',
      url: 'https://trudy.example.com',
      avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
      desc: 'Trudy works on full-stack web applications.',
    },
  ];

  return (
    <div>
      <header className="prose prose-p:my-2 font-mono">
        <h1>朋友们</h1>
        <h3>海内存知己，天涯若比邻</h3>
      </header>

      <main className="mt-10 flex w-full flex-col">
        <FriendCardList data={friendData} />
      </main>
    </div>
  );
}

const FriendCardList = ({ data }: { data: FriendModel[] }) => (
  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
    {data.map((friendModel) => {
      return <FriendCard friendModel={friendModel} />;
    })}
  </div>
);
const FriendCard = ({ friendModel }: { friendModel: FriendModel }) => {
  const [enter, setEnter] = useState(false);

  return (
    <motion.div
      key={friendModel.name}
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
    </motion.div>
  );
};
const LayoutBg = memo(() => {
  return (
    <motion.span
      layoutId="bg"
      className="absolute -inset-2 z-[-1] rounded-md bg-slate-200/80 dark:bg-neutral-600/80 pointer-events-none"
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.2 } }}
    />
  );
});
