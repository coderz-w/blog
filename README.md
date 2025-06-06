## 仿 Shiro 纯前端博客

### :wrench: 技术栈

- **Next.js (App Router)**
- **Zustand**
- **Framer Motion**
- **TailwindCSS**

### :sparkles: 特色功能

- ⚡ **快速**：利用 Next.js 的 SSR 与 RSC 技术优化首屏加载性能，配合内链路由预加载，显著提升用户交互流畅度。
- 🛠️ **简洁易用**：纯前端架构，部署便捷，支持一键部署至 Vercel。通过简单修改配置文件，自定义元数据、主题配色等内容，轻松打造个性化博客。
- 💎 **UI**：响应式布局，完美适配移动端与 PC 端，基于 Framer Motion 实现流畅的弹性动画，增强用户互动体验。
- 📈 **SEO**：提供完善的 MetaData，兼容 Open Graph 协议与 RSS 订阅。
- 🌍 **国际化支持**：所有静态内容均兼容中英文，基于用户浏览器语言自动切换。

### 📄 使用

- 克隆此仓库，使用 `pnpm i` 下载依赖，`pnpm run dev` 启动项目。
- 用户可以修改 `config` 文件配置：
  - `about.ts`：修改首页的 Hero 区域文字。
  - `color.ts`：自定义主题色。
  - `friends.ts`：配置友链。
  - `introduction.ts`：配置个人介绍。
  - `projects.ts`：配置项目列表。
  - `seo.ts`：配置 SEO 优化项（如网页的 title、description 等 MetaData）。
  - `signature.tsx`：用户个性签名,建议使用figma输入文字选择字体然后导出为svg 。
- 文章存放在 `markdown` 文件夹下，同时需要修改 `markdown/index.json` 文件，添加文章的元数据。
- 文章的封面图片需放在 `public/postCoverImage` 目录下。

## :heart: 鸣谢

项目参考了 [Innei](https://github.com/innei/) 的 [个人网站](https://innei.in/)，感谢大佬的开源！
