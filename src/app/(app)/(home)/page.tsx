'use client';

import { motion } from 'framer-motion';
import { createElement, useEffect, useState } from 'react';
import Image from 'next/image';

import { TextUpTransitionView } from '@/components/ui/transition/TextUpTransitionView';
import { SocialIcon } from '@/components/modules/home/SocialIcon';
import { cn } from '@/lib/helper';

export default function Home() {
  return (
    <div>
      <Hero />
    </div>
  );
}

const TwoColumnLayout = ({
  children,
  leftContainerClassName,
  rightContainerClassName,
  className,
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode];

  leftContainerClassName?: string;
  rightContainerClassName?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative mx-auto block size-full min-w-0 max-w-[1800px] flex-col flex-wrap items-center lg:flex lg:flex-row',
        className,
      )}
      style={{ padding: '0 20px' }} // 增加内边距
    >
      {children.slice(0, 2).map((child, i) => (
        <div
          key={i}
          className={cn(
            'flex w-full flex-col center lg:h-auto lg:w-1/2',
            i === 0 ? leftContainerClassName : rightContainerClassName,
          )}
        >
          <div className="relative max-w-full lg:max-w-2xl">{child}</div>
        </div>
      ))}

      {children[2]}
    </div>
  );
};

const Hero = () => {
  const title = {
    template: [
      { type: 'h1', text: `Hi, I'm zw👋`, class: ' font-light text-4xl font-900' },
      {
        type: 'span',
        text: 'A NodeJS Full Stack ',
        class: 'font-light text-4xl font-900 inline-block mt-[20px]',
      },
      {
        type: 'code',
        text: '<Developer />',
        class:
          ' inline-block font-medium mx-2 text-3xl rounded p-2 bg-gray-200 dark:bg-gray-800/0 hover:dark:bg-gray-800/100 bg-opacity-0 hover:bg-opacity-100 transition-background duration-200"><div><span class="inline-block whitespace-pre',
      },
    ],
  };

  const description = 'An independent developer coding with love.';

  const siteOwner = {
    avatar: '/image/owner.jpg',
    socialIds: {
      github: 'https://github.com/yangxuanxuan1998',
      twitter: 'https://twitter.com/yangxuanxuan1998',
    },
  };

  const { avatar, socialIds } = siteOwner;

  const titleAnimateD =
    title.template.reduce((acc, cur) => {
      return acc + (cur.text?.length || 0);
    }, 0) * 50;

  return (
    <div className="mt-[-2.5rem] min-w-0 md:px-44 max-w-screen overflow-hidden lg:mt-[-6.5rem] lg:h-dvh lg:min-h-[800px]">
      <TwoColumnLayout leftContainerClassName="mt-[110px] lg:mt-0 lg:h-[15rem] lg:h-1/2">
        <>
          <motion.div
            className=" relative text-center leading-[4] lg:text-left lg:ml-24 lg:mt-10"
            initial={{ y: 50, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          >
            {title.template.map((t, i) => {
              const { type, text, class: className } = t;

              const prevAllTextLength = title.template.slice(0, i).reduce((acc, cur) => {
                return acc + (cur.text?.length || 0);
              }, 0);

              return text
                ? createElement(
                    type,
                    { key: i, className },
                    <TextUpTransitionView eachDelay={0.05} initialDelay={prevAllTextLength * 0.05}>
                      {text}
                    </TextUpTransitionView>,
                  )
                : null;
            })}
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              damping: 10,
              stiffness: 100,
              delay: titleAnimateD / 1000,
            }}
            className="my-3 text-center lg:text-left lg:ml-24"
          >
            <span className=" opacity-70"> {description}</span>
          </motion.div>

          <ul className="center mx-[60px] mt-8 flex flex-wrap gap-6 lg:mx-auto lg:mt-14 lg:justify-start lg:gap-4 lg:ml-24">
            {Object.entries(socialIds).map(([type, id]) => (
              <motion.li
                key={type}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  damping: 10,
                  stiffness: 100,
                  delay: titleAnimateD / 1000,
                }}
                className="inline-block"
              >
                <SocialIcon id={id} type={type} />
              </motion.li>
            ))}
          </ul>
        </>
        <div className={cn('lg:size-[300px]', 'size-[200px]', 'mt-24 lg:mt-0')}>
          <Image
            height={300}
            width={300}
            src={avatar!}
            alt="Site Owner Avatar"
            className={cn(
              'aspect-square rounded-full border border-slate-200 dark:border-neutral-800',
              'w-full',
            )}
          />
        </div>
        <Quote />
      </TwoColumnLayout>
    </div>
  );
};

const Quote = () => {
  const [quote, setQuote] = useState({ hitokoto: '', from: '' });
  const getQuote = async () => {
    const { hitokoto, from } = await fetch('/api/quote').then((res) => res.json());
    setQuote({ hitokoto, from });
  };

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0.0001, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      className={cn(
        'center inset-x-0 bottom-0 mt-14 flex flex-col lg:absolute lg:bottom-[-12px] group',
        'center text-neutral-800/80 dark:text-neutral-200/80',
      )}
    >
      <small className=" flex text-center items-center ">
        {quote.hitokoto}
        <span className=" text-center ml-4">— {quote.from}</span>
        <motion.span onClick={() => getQuote()} className=" flex items-center ml-3 cursor-pointer">
          <i className="i-mingcute-refresh-2-line invisible group-hover:visible"></i>
        </motion.span>
      </small>
      <span className="mt-6 animate-bounce">
        <i className="i-mingcute-right-line rotate-90 text-2xl" />
      </span>
    </motion.div>
  );
};
