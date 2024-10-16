import type { PropsWithChildren } from 'react';

const Content = ({ children }: PropsWithChildren) => {
  return <main className="relative z-[1] px-4 pt-[4.5rem] fill-content md:px-0">{children}</main>;
};

export default Content;
