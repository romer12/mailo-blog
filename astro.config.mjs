// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

// 获取端口号，默认 4321
const PORT = parseInt(process.env.PORT || '4321', 10);


// https://astro.build/config
export default defineConfig({
    site: 'https://romer.dpdns.org/', // 替换为你的实际域名
    output: 'static',
    integrations: [sitemap()],
    server: {
        port: PORT,
        host: true
    },
    build: {
        format: 'directory'
    },
    markdown: {
        // Shiki代码高亮
        // shikiConfig: {
        //     theme: 'github-dark',
        //     wrap: true
        // },
        // 禁用 Shiki代码高亮，切换到highlight.js高亮
        syntaxHighlight: false,
        remarkPlugins: [],
        rehypePlugins: []
    }
});
