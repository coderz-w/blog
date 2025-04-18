import React from 'react';

import { TocAside } from '../toc/TocAside';
import { ReadIndicator } from './ReadIndicator';

export const ArticleRightAside = ({ children, locale }: any) => {
  return (
    <aside className="sticky top-[120px] mt-[120px] h-[calc(100vh-6rem-4.5rem-150px-120px)]">
      <div className="relative h-full">
        <TocAside
          as="div"
          className="static ml-4"
          treeClassName="absolute h-full min-h-[120px] flex flex-col"
          accessory={<ReadIndicator locale={locale} />}
        />
      </div>
      {!!children &&
        React.cloneElement(children as any, {
          className: 'translate-y-[calc(100%+24px)]',
        })}
    </aside>
  );
};
