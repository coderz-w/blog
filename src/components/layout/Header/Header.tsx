import { memo } from 'react';

import { HeaderWithShadow } from './HeaderWithShadow';
import { BlurredBackground } from './BluredBackground';
import { HeaderCenterArea, HeaderLeftButtonArea, HeaderLogoArea } from './HeaderArea';
import { HeaderCenterContent } from './HeaderCenterContent';
import { AnimatedLogo } from './AnimatedLogo';
import styles from './header.module.css';
import { HeaderMeta } from './HeaderMeta';
import { HeaderDrawerButton } from './HeaderDrawerButton';

import { cn } from '@/lib/helper';
import { buildPostData } from '@/core';

const { postDataMap } = buildPostData();

const Header = () => {
  return (
    <HeaderWithShadow>
      <BlurredBackground />
      <div
        className={cn(
          ' relative mx-auto grid h-full min-h-0 max-w-7xl grid-cols-[4.5rem_auto_4.5rem] lg:px-8',
          styles['header--grid'],
        )}
      >
        <HeaderLeftButtonArea>
          <HeaderDrawerButton />
        </HeaderLeftButtonArea>

        <HeaderLogoArea>
          <AnimatedLogo />

          <div className="block lg:hidden">
            <HeaderMeta postDataMap={postDataMap} />
          </div>
        </HeaderLogoArea>
        <div className=" sr-only"></div>
        <HeaderCenterArea>
          <HeaderCenterContent />
          <HeaderMeta postDataMap={postDataMap} />
        </HeaderCenterArea>

        {/* <div className="flex size-full [grid-area:right] items-center"></div> */}
      </div>
    </HeaderWithShadow>
  );
};

export default memo(Header);
