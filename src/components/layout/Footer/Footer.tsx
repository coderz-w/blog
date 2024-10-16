import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

const Footer = () => {
  return (
    <footer
      data-hide-print
      className="relative z-[1] h-40 mt-32 border-t border-x-uk-separator-opaque-light py-6 text-base-content/80 dark:border-white/10"
    >
      <div className="px-4 sm:px-8 h-full">
        <div className="relative mx-auto max-w-7xl lg:px-8 h-full">
          <div className="mt-6 block text-center md:absolute md:bottom-0 md:right-0 md:mt-0">
            <ThemeSwitcher></ThemeSwitcher>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
