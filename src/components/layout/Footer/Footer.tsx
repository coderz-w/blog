import Link from 'next/link';

import { PrefetchLink } from '@/components/modules/shared/PrefetchLink';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import localeValues from '@/locale';
import { getUserLocale } from '@/lib/getLocale';

const Footer = () => {
  const lang = getUserLocale();
  const homeLocale = localeValues[lang].home;

  return (
    <footer
      data-hide-print
      className="relative z-[1] h-28 mt-44 pb-6 border-t border-x-uk-separator-opaque-light py-6 text-base-content/80 dark:border-white/10"
    >
      <div className="px-4 sm:px-8 h-full">
        <div className="relative mx-auto max-w-7xl lg:px-8 h-full flex flex-row items-center justify-around">
          <div className=" flex items-center gap-x-4 font-mono">
            <span className="">
              <PrefetchLink href={'/about'}>
                <span className=" relative before:content-[''] before:absolute before:bottom-[-2px] before:w-[0px] hover:before:w-[100%] before:h-[1px] before:bg-[var(--accent-color)] before:transition-all before:duration-300">
                  {homeLocale.aboutMe}
                </span>
              </PrefetchLink>
            </span>
            <span className="">
              <Link href={'https://github.com/coderz-w/blog'}>
                <span className=" relative before:content-[''] before:absolute before:bottom-[-2px] before:w-[0px] hover:before:w-[100%] before:h-[1px] before:bg-[var(--accent-color)] before:transition-all before:duration-300">
                  {homeLocale.thisProject}
                </span>
              </Link>
            </span>
          </div>
          <div className=" flex items-center text-center md:absolute md:bottom-0 md:right-0">
            <ThemeSwitcher></ThemeSwitcher>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
