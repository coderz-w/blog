import type { PropsWithChildren } from 'react';

// import { ClientOnly } from '~/components/common/ClientOnly';

import Content from '../Content';
import Footer from '../Footer';
// import { Header } from '../Header';

const Root = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* <Header /> */}
      <Content>{children}</Content>

      <Footer />
      {/* <ClientOnly>
        <FABContainer />
      </ClientOnly> */}
    </>
  );
};

export default Root;
