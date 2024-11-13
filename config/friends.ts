export const friendsList: FriendModel[] = [
  {
    name: 'YYGod',
    url: 'https://www.yygod0120.com/zh-CN/about',
    avatar: 'https://avatars.githubusercontent.com/u/116366929?v=4',
    desc: '',
  },
  {
    name: 'CeazzZY',
    url: 'https://ceazzzy.github.io/',
    avatar: 'https://avatars.githubusercontent.com/u/60310690?v=4',
    desc: '字节架构师',
  },
  {
    name: 'sunsunmonkey',
    url: 'https://sunsunmonkey.github.io/',
    avatar: 'https://avatars.githubusercontent.com/u/116412388?v=4',
    desc: '',
  },
  {
    name: 'seasaon',
    url: 'https://seasonhl.github.io/',
    avatar: 'https://avatars.githubusercontent.com/u/93079830?v=4',
    desc: '',
  },
];

export interface FriendModel {
  name: string;
  url: string;
  avatar: string;
  desc: string;
}
