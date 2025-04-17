const localeValues = {
  zh: {
    lang: 'zh',
    home: {
      lang: 'zh',
      recentPosts: '最近文章',
      windVane: '风向标',
      writing: '文稿',
      friends: '朋友们',
      whatIDo: '看看我的项目',
      jump: '跃迁',
      aboutMe: '关于我',
      thisProject: '此项目',
    },
    friends: {
      friends: '朋友们',
      quote: '海内存知己，天涯若比邻',
    },
    about: {
      about: '关于我',
    },
    projects: {
      projects: '项目',
    },
  },
  en: {
    lang: 'en',
    home: {
      lang: 'en',
      recentPosts: 'Recent Posts',
      windVane: 'Wind Vane',
      writing: 'Writing',
      friends: 'Friends',
      whatIDo: 'Check Out My Projects',
      jump: 'Jump',
      aboutMe: 'About Me',
      thisProject: 'This Project',
    },
    friends: {
      friends: 'friends',
      quote: 'True friends are never apart, maybe in distance but never in heart',
    },
    about: {
      about: 'about',
    },
    projects: {
      projects: 'projects',
    },
  },
};

type HomeLocaleValues = typeof localeValues.zh.home;

export type { HomeLocaleValues };

export default localeValues;
