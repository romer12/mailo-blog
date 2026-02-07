import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(), // 文章标题
        description: z.string().optional(), // 文章描述/摘要
        publishDate: z.coerce.date(), // 发布日期
        updatedDate: z.coerce.date().optional(), // 更新日期
        heroImage: z.string().optional(), // 封面图片URL
        category: z.string().optional(), // 文章分类
        tags: z.array(z.string()).default([]), // 文章标签
        draft: z.boolean().default(false), // 是否为草稿
        author: z.string().default('止于秋水'), // 作者
        pinned: z.boolean().default(false), // 是否置顶
    }),
});

export const collections = { blog };
