import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });

  const searchData = posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description || '',
    publishDate: post.data.publishDate.toISOString(),
    category: post.data.category || '',
    tags: post.data.tags || []
  }));

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
