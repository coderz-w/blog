import { memo } from 'react';

import { HeaderWithShadow } from './HeaderWithShadow';
import { BlurredBackground } from './BluredBackground';
import { HeaderCenterArea, HeaderLeftButtonArea, HeaderLogoArea } from './HeaderArea';
import { HeaderCenterContent } from './HeaderCenterContent';
import { AnimatedLogo } from './AnimatedLogo';
import styles from './header.module.css';

import { cn } from '@/lib/helper';

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
        <HeaderLeftButtonArea>小菜单</HeaderLeftButtonArea>

        <HeaderLogoArea>
          <AnimatedLogo />
        </HeaderLogoArea>
        <div className=" sr-only"></div>
        <HeaderCenterArea>
          <HeaderCenterContent />
          {/* TODO 文章页面时显示一些文章信息 */}
        </HeaderCenterArea>

        {/* <div className="flex size-full [grid-area:right] items-center"></div> */}
      </div>
    </HeaderWithShadow>
  );
};

export default memo(Header);
