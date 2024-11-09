'use client';

import { m } from 'framer-motion';
import { createElement, useEffect, useState } from 'react';
import Image from 'next/image';

import { SocialIcon } from '../SocialIcon';

import { TextUpTransitionView } from '@/components/ui/transition/TextUpTransitionView';
import { cn } from '@/lib/helper';
import { TwoColumnLayout } from '@/components/layout/TwoColumnLayout';
import { heroDesc, heroOwnerInfo, heroTitle } from '~/about';

export const Hero = () => {
  const { avatar, socialIds } = heroOwnerInfo;

  const titleAnimateD =
    heroTitle.template.reduce((acc, cur) => {
      return acc + (cur.text?.length || 0);
    }, 0) * 50;

  return (
    <div className="mt-[-2.5rem] min-w-0 md:px-44 max-w-screen overflow-hidden lg:mt-[-6.5rem] lg:h-dvh lg:min-h-[800px]">
      <TwoColumnLayout leftContainerClassName="mt-[110px] lg:mt-0 lg:h-[15rem] lg:h-1/2">
        <>
          <m.div
            className=" relative text-center leading-[4] lg:text-left lg:ml-24 lg:mt-10"
            initial={{ y: 50, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          >
            {heroTitle.template.map((t, i) => {
              const { type, text, class: className } = t;

              const prevAllTextLength = heroTitle.template.slice(0, i).reduce((acc, cur) => {
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
          </m.div>

          <m.div
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
            <span className=" opacity-70"> {heroDesc}</span>
          </m.div>

          <ul className="center mx-[60px] mt-8 flex flex-wrap gap-6 lg:mx-auto lg:mt-24 lg:justify-start lg:gap-4 lg:ml-24">
            {Object.entries(socialIds).map(([type, id], index) => (
              <m.li
                key={type}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  damping: 10,
                  stiffness: 100,
                  delay: titleAnimateD / 1000 + index * 0.08,
                }}
                className="inline-block"
              >
                <SocialIcon id={id} type={type} />
              </m.li>
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
    <m.div
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
        <m.span onClick={() => getQuote()} className=" flex items-center ml-3 cursor-pointer">
          <i className="i-mingcute-refresh-2-line invisible group-hover:visible"></i>
        </m.span>
      </small>
      <span className="mt-6 animate-bounce">
        <i className="i-mingcute-right-line rotate-90 text-2xl" />
      </span>
    </m.div>
  );
};
