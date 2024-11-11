import RSS from 'rss';
import { compiler } from 'markdown-to-jsx';

import { siteUrl, seo } from '~/seo';
import { buildPostData } from '@/core';

const { postDataList } = buildPostData();

export async function GET() {
  const ReactDOM = (await import('react-dom/server')).default;

  const feed = new RSS({
    title: seo.title,
    description: '记录我的生活',
    site_url: siteUrl.toString(),
    feed_url: `${siteUrl}/feed.xml`,
    language: 'zh-CN',
    image_url: `${siteUrl}/api/og`,
    generator: 'Next 14',
  });

  postDataList.forEach((post) => {
    const render = () => {
      try {
        return ReactDOM.renderToString(
          <div>
            {compiler(post.text, {
              overrides: {
                LinkCard: NotSupportRender,
                Gallery: NotSupportRender,
                Tabs: NotSupportRender,
                Tab: NotSupportRender,

                img: ({ src, alt, height, width }) => {
                  return <img src={src} alt={alt} height={height} width={width} />;
                },
              },
              extendsRules: {
                codeBlock: {
                  react(node, output, state) {
                    return (
                      <pre
                        key={state.key}
                        className={node.lang ? `language-${node.lang} lang-${node.lang}` : ''}
                      >
                        <code
                          className={node.lang ? `language-${node.lang} lang-${node.lang}` : ''}
                        >
                          {node.content}
                        </code>
                      </pre>
                    );
                  },
                },
              },
            })}
          </div>,
        );
      } catch {
        return ReactDOM.renderToString(
          <p>
            当前内容无法在 RSS 阅读器中正确渲染，请前往：
            <a href={`${siteUrl}/notes/${post.title}`}>{`${siteUrl}/notes/${post.title}`}</a>
          </p>,
        );
      }
    };

    feed.item({
      title: post.title,
      guid: post.title,
      url: `${siteUrl}/notes/${post.title}`,
      description: render(),
      date: post.createdAt!,
      enclosure: {
        url: post.coverImage,
        type: 'image/jpeg',
      },
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}

const NotSupportRender = () => {
  throw new Error('Not support render in RSS');
};
