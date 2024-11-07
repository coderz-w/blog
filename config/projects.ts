export const projectList: ProjectModel[] = [
  { id: '1', name: 'blog', url: 'https://github.com/coderz-w/blog', desc: '我的个人博客' },
  {
    id: '2',
    name: 'online-edit-web',
    url: 'https://github.com/xun082/online-edit-web',
    desc: '基于webContainer的代码编辑器',
  },
  { id: '6', name: 'canvas', url: 'https://github.com/coderz-w/canvas', desc: 'canvas画板' },
];

export interface ProjectModel {
  id: string | number;
  name: string;
  url: string;
  avatar?: string;
  desc: string;
}
