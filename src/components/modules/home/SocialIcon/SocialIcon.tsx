import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { BilibiliIcon } from '@/components/icons/platform/BilibiliIcon';
import { NeteaseCloudMusicIcon } from '@/components/icons/platform/NeteaseIcon';
import { MotionButtonBase } from '@/components/ui/button';
import { FloatPopover } from '@/components/ui/float-popover';

interface SocialIconProps {
  type: string;
  id: string;
}

const iconSet: Record<string, [string, ReactNode, string, (id: string) => string]> = {
  github: [
    'Github',
    <i className="i-mingcute-github-line" />,
    '#181717',
    (id) => `https://github.com/${id}`,
  ],
  twitter: [
    'Twitter',
    <i className="i-mingcute-twitter-line" />,
    '#1DA1F2',
    (id) => `https://twitter.com/${id}`,
  ],
  mail: ['Email', <i className="i-mingcute-mail-line" />, '#D44638', (id) => `mailto:${id}`],
  get email() {
    return this.mail;
  },
  get feed() {
    return this.rss;
  },
  bilibili: ['哔哩哔哩', <BilibiliIcon />, '#00A1D6', (id) => `https://space.bilibili.com/${id}`],
  netease: [
    '网易云音乐',
    <NeteaseCloudMusicIcon />,
    '#C20C0C',
    (id) => `https://music.163.com/#/user/home?id=${id}`,
  ],
  qq: [
    'QQ',
    <i className="i-mingcute-qq-fill" />,
    '#1e6fff',
    (id) => `https://wpa.qq.com/msgrd?v=3&uin=${id}&site=qq&menu=yes`,
  ],
  wechat: ['微信', <i className="i-mingcute-wechat-fill" />, '#2DC100', (id) => id],
  weibo: [
    '微博',
    <i className="i-mingcute-weibo-line" />,
    '#E6162D',
    (id) => `https://weibo.com/${id}`,
  ],
  discord: [
    'Discord',
    <i className="i-mingcute-discord-fill" />,
    '#7289DA',
    (id) => `https://discord.gg/${id}`,
  ],
};
const icons = Object.keys(iconSet);

export const isSupportIcon = (icon: string) => icons.includes(icon);
export const SocialIcon = memo((props: SocialIconProps) => {
  const { id, type } = props;

  const [name, Icon, iconBg, hrefFn] = useMemo(() => {
    const [name, Icon, iconBg, hrefFn] = (iconSet as any)[type as any] || [];

    return [name, Icon, iconBg, hrefFn];
  }, [type]);

  if (!name) return null;

  const href = hrefFn(id);

  return (
    <FloatPopover
      type="tooltip"
      triggerElement={
        <MotionButtonBase
          aria-label={`${name}-icon`}
          className="center flex aspect-square size-10 rounded-full text-2xl text-white"
          style={{
            background: iconBg,
          }}
        >
          <a
            target="_blank"
            aria-label={`${name}-link`}
            href={href}
            className="center flex"
            rel="noreferrer"
          >
            {Icon}
          </a>
        </MotionButtonBase>
      }
    >
      {name}
    </FloatPopover>
  );
});
SocialIcon.displayName = 'SocialIcon';
