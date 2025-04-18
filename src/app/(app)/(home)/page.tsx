import { getPostData } from '@/core';
import { FocusCards } from '@/components/ui/focus-cards.tsx';
import { Hero } from '@/components/modules/home/Hero';
import { WindVane } from '@/components/modules/home/WindVane/WindVane';
import localeValues, { type HomeLocaleValues } from '@/locale';
import { getUserLocale } from '@/lib/getLocale';

const { postDataList } = await getPostData();

export default async function Home() {
  const lang = getUserLocale();
  const homeLocale = localeValues[lang].home;

  return (
    <div>
      <Hero />
      <BlogCardList homeLocale={homeLocale} />
      <WindVane homeLocale={homeLocale} />
    </div>
  );
}

const BlogCardList = ({ homeLocale }: { homeLocale: HomeLocaleValues }) => {
  return (
    <div className=" w-full mt-10 md:mt-16 flex flex-col gap-y-8 px-4">
      <span className="text-2xl font-medium leading-loose justify-center md:justify-start md:ml-4 font-mono gap-x-2 items-center flex">
        {homeLocale.recentPosts}
        <span className=" i-material-symbols-kid-star-outline cursor-pointer hover:rotate-[720deg] animate-ease-out duration-150" />
      </span>
      <FocusCards postCards={postDataList} />
    </div>
  );
};
