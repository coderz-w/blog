import clsx from 'clsx';
import type { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';
import React from 'react';
import Link from 'next/link';

export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props;
  const { className, ...rest } = other;

  if (React.Children.count(children) === 1) {
    const child = React.Children.toArray(children)[0];

    if (isImage(child)) {
      return children;
    }

    // isLink
    if (isLink(child)) {
      const children = (child as any)?.props?.children as ReactNode[];

      return <Link href={(child as any)?.props?.href}>{children}</Link>;
    }
  }

  return (
    <p className={clsx('paragraph', className)} {...rest}>
      {children}
    </p>
  );
};

const isImage = (child: any) => {
  if (typeof child === 'object' && (child as any)?.props?.src) {
    return true;
  }

  return false;
};
const isLink = (child: any) => {
  if (
    typeof child === 'object' &&
    (child as any)?.props?.href &&
    (child as any)?.props?.children?.length === 1
  ) {
    return true;
  }

  return false;
};
