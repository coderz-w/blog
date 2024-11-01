'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useMemo } from 'react';
import { m } from 'framer-motion';

export const AnimatedLogo = () => {
  const router = useRouter();
  const pathName = usePathname();
  const handleClick = useMemo(() => () => router.push('/'), [pathName]);

  return (
    <button className=" cursor-pointer" onClick={() => handleClick()}>
      <SideOwnerAvatar />
      <span className="sr-only">Owner Avatar</span>
    </button>
  );
};

const SideOwnerAvatar = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pointer-events-none relative z-[9] size-[40px] select-none"
    >
      <div className=" mask mask-squircle overflow-hidden">
        <Image
          src="/image/owner.jpg"
          alt="Site Owner Avatar"
          width={40}
          height={40}
          className="ring-2 ring-slate-200 dark:ring-neutral-800"
        />
      </div>
    </m.div>
  );
};
