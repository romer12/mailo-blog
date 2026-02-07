import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });

  // 按发布日期排序，置顶文章排在最前
  const sortedPosts = posts.sort((a, b) => {
    // 先按置顶排序
    if (a.data.pinned && !b.data.pinned) return -1;
    if (!a.data.pinned && b.data.pinned) return 1;
    // 再按发布日期排序
    return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
  });

  return rss({
    title: '止于秋水',
    description: '一个现代化的博客系统',
    site: context.site || 'https://your-domain.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description || '',
      link: `/blog/${post.slug}/`,
      categories: post.data.tags || [],
      author: post.data.author || '止于秋水',
    })),
    customData: `<language>zh-CN</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
