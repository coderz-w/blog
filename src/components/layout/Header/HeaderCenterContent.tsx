'use client';

import { LayoutGroup, m, useMotionTemplate, useMotionValue } from 'framer-motion';
import React, { memo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';

import { MenuPopover } from './MenuPopover';

import { cn } from '@/lib/helper';
import { IHeaderMenu, headerMenuConfig } from '~/router';

export const HeaderCenterContent = () => {
  const params = useParams();
  if (params.nid) return null;

  return (
    <LayoutGroup>
      <AnimatedMenu>
        <DesktopNav />
      </AnimatedMenu>
    </LayoutGroup>
  );
};

const AnimatedMenu = ({ children }: { children: React.ReactElement }) => {
  //TODO 根据滚动值来控制动画
  return (
    <m.div
      className="duration-100"
      style={{
        opacity: 1,
        visibility: 'visible',
      }}
    >
      {React.cloneElement(children, {})}
    </m.div>
  );
};

const DesktopNav = () => {
  const pathname = usePathname();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - bounds.left);
      mouseY.set(clientY - bounds.top);
      radius.set(Math.hypot(bounds.width, bounds.height) / 2.5);
    },
    [mouseX, mouseY, radius],
  );

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`;

  return (
    <m.nav
      layout="size"
      onMouseMove={handleMouseMove}
      className={cn(
        'relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        'group [--spotlight-color:oklch(var(--a)_/_0.32)]',
        'pointer-events-auto duration-200',
        // shouldHideNavBg && '!bg-none !shadow-none !ring-transparent',
      )}
    >
      {/* hover背景效果 */}
      <m.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />
      <div className="flex px-4 font-medium text-zinc-800 dark:text-zinc-200">
        {headerMenuConfig.map((section) => {
          const subItemActive =
            section.subMenu?.findIndex((item) => {
              return item.path === pathname || pathname.slice(1) === item.path;
            }) ?? -1;

          return (
            <HeaderMenuItem
              section={section}
              key={section.path}
              subItemActive={section.subMenu?.[subItemActive]}
              isActive={
                pathname === section.path ||
                pathname.startsWith(`${section.path}/`) ||
                subItemActive > -1 ||
                false
              }
            />
          );
        })}
      </div>
    </m.nav>
  );
};

const HeaderMenuItem = memo<{
  section: IHeaderMenu;
  isActive: boolean;
  subItemActive?: IHeaderMenu;
}>(({ section, isActive, subItemActive }) => {
  const href = section.path;

  return (
    <MenuPopover subMenu={section.subMenu} key={href}>
      <AnimatedItem href={href} isActive={isActive} className="transition-[padding]">
        <span className="relative flex items-center">
          {isActive && (
            <m.span layoutId="header-menu-icon" className="mr-2 flex items-center">
              {subItemActive?.icon ?? section.icon}
            </m.span>
          )}
          <m.span layout>{subItemActive?.title ?? section.title}</m.span>
        </span>
      </AnimatedItem>
    </MenuPopover>
  );
});

function AnimatedItem({
  href,
  children,
  className,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}) {
  return (
    <div>
      <Link
        href={href}
        className={cn(
          'relative block whitespace-nowrap px-4 py-2 transition',
          isActive ? 'text-accent' : 'hover:text-accent/80',
          isActive ? 'active' : '',
          className,
        )}
      >
        {children}
        {isActive && (
          <m.span
            className={cn(
              'absolute inset-x-1 -bottom-px h-px',
              'bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0',
            )}
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </div>
  );
}
