import Link from 'next/link';

import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

const Footer = () => {
  return (
    <footer
      data-hide-print
      className="relative z-[1] h-28 mt-32 pb-6 border-t border-x-uk-separator-opaque-light py-6 text-base-content/80 dark:border-white/10"
    >
      <div className="px-4 sm:px-8 h-full">
        <div className="relative mx-auto max-w-7xl lg:px-8 h-full flex flex-row items-center justify-around">
          <div className=" flex items-center gap-x-4 font-mono">
            <span className="">
              <Link href={'/'}>
                <span className=" relative before:content-[''] before:absolute before:bottom-[-2px] before:w-[0px] hover:before:w-[100%] before:h-[1px] before:bg-[var(--accent-color)] before:transition-all before:duration-300">
                  关于我
                </span>
              </Link>
            </span>
            <span className="">
              <Link href={'/'}>
                <span className=" relative before:content-[''] before:absolute before:bottom-[-2px] before:w-[0px] hover:before:w-[100%] before:h-[1px] before:bg-[var(--accent-color)] before:transition-all before:duration-300">
                  此项目
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
