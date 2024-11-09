export const heroTitle = {
  template: [
    { type: 'h1', text: `Hi, I'm `, class: ' font-light text-4xl font-900 inline-block' },
    { type: 'h1', text: `zw`, class: ' text-4xl font-bold inline-block' },
    {
      type: 'h1',
      text: `👋`,
      class:
        ' font-light text-4xl font-bold inline-block hover:scale-[1.05] cursor-pointer origin-center transition-all',
    },
    { type: 'h1', text: ` `, class: ' h-0 w-0 leading-none' },
    {
      type: 'span',
      text: 'A Javascript',
      class: 'font-light text-4xl font-900 inline-block mt-[5px]',
    },
    {
      type: 'code',
      text: ' <Developer />',
      class:
        ' inline-block font-medium mx-2 text-3xl rounded p-2 bg-gray-200 dark:bg-gray-800/0 hover:dark:bg-gray-800/100 bg-opacity-0 hover:bg-opacity-100 transition-background duration-200"><div><span class="inline-block whitespace-pre',
    },
  ],
};

export const heroDesc = 'coding with love.';

export const heroOwnerInfo = {
  avatar: '/image/owner.jpg',
  socialIds: {
    github: 'coderz-w',
    bilibili: '515746437',
    qq: '3331598351',
    netease: '8257705181',
  },
};
