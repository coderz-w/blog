import type { PropsWithChildren } from 'react';
// import { Analytics } from '@vercel/analytics/react';

import Content from '../Content';
import Footer from '../Footer';
import Header from '../Header';

const Root = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <Content>{children}</Content>
      <Footer />
      {/* <Analytics />, */}
    </>
  );
};

export default Root;
