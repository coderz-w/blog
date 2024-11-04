'use client';

import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { usePostLayoutRightStore } from '@/store/postLayoutRightStore';
import useIsClient from '@/hooks/common/use-is-client';

export const LayoutRightSideProvider = ({ className }: { className: string }) => {
  const { setElement, resetElement } = usePostLayoutRightStore(
    useShallow((state) => ({
      setElement: state.setElement,
      resetElement: state.resetElement,
    })),
  );
  const divRef = React.useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    console.log('LayoutRightSideProvider', divRef.current);
    setElement(divRef.current!);

    return () => {
      resetElement();
    };
  }, []);

  return <div ref={divRef} className={className} />;
};

export const LayoutRightSidePortal = ({ children }: { children: React.ReactNode }) => {
  const rightSideElement = usePostLayoutRightStore((state) => state.Element);

  const isClient = useIsClient();
  if (!isClient) return null;

  if (!rightSideElement) return null;

  return createPortal(children, rightSideElement);
};
