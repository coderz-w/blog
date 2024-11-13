## 仿 Shiro 纯前端博客

### :wrench: 技术栈

- **Next.js (App Router)**
- **Zustand**
- **Framer Motion**
- **TailwindCSS**

### :sparkles: 特色功能

- ⚡ **快速**：通过 Next.js 的 SSR 和 RSC 优化首屏加载时间，部分内链实现跳转路由预加载，提升用户体验。
- 🌱 **简洁易用**：纯前端架构，搭建简单，支持在 Vercel 上一键部署。用户可通过修改配置文件轻松自定义元数据、主题色等内容。
- 🔮 **UI**：响应式布局，完美适配移动端与 PC 端，基于 Framer Motion 实现流畅的弹性动画，增强用户互动体验。
- 🔮 **SEO**：完善的MetaData,支持open graph,支持RSS订阅。

### 📄 使用

- 克隆此仓库，使用 `pnpm i` 下载依赖，`pnpm run dev` 启动项目。
- 用户可以修改 `config` 文件配置：
  - `about.ts`：修改首页的 Hero 区域文字。
  - `color.ts`：自定义主题色。
  - `friends.ts`：配置友链。
  - `introduction.ts`：配置个人介绍。
  - `projects.ts`：配置项目列表。
  - `seo.ts`：配置 SEO 优化项（如网页的 title、description 等 MetaData）。
- 文章存放在 `markdown` 文件夹下，同时需要修改 `markdown/index.json` 文件，添加文章的元数据。
- 文章的封面图片需放在 `public/postCoverImage` 目录下。

## :heart: 鸣谢

项目参考了 [Innei](https://github.com/innei/) 的 [个人网站](https://innei.in/)，感谢大佬的开源！
