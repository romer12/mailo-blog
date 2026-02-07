// 目录生成工具函数
export interface TocItem {
  depth: number;
  slug: string;
  text: string;
  subheadings: TocItem[];
}

/**
 * 从 HTML 内容中提取标题并生成目录
 * @param content HTML 内容元素
 * @returns 目录项数组
 */
export function generateTocFromContent(content: HTMLElement): TocItem[] {
  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length === 0) {
    return [];
  }

  const root: TocItem = { depth: 0, slug: 'root', text: 'Root', subheadings: [] };
  const stack: TocItem[] = [root];

  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;

    const depth = parseInt(heading.tagName.substring(1));
    const text = heading.textContent || '';
    
    const tocItem: TocItem = {
      depth,
      slug: id,
      text,
      subheadings: []
    };

    // 找到正确的父级
    while (stack[stack.length - 1].depth >= tocItem.depth) {
      stack.pop();
    }

    // 添加到父级的子标题中
    stack[stack.length - 1].subheadings.push(tocItem);
    
    // 推入栈中
    stack.push(tocItem);
  });

  return root.subheadings;
}

/**
 * 渲染目录项为 HTML
 * @param items 目录项数组
 * @returns HTML 字符串
 */
export function renderTocItems(items: TocItem[]): string {
  if (items.length === 0) {
    return '<p class="toc-empty">暂无目录</p>';
  }

  function renderItem(item: TocItem): string {
    const hasSubheadings = item.subheadings.length > 0;
    const subheadingsHtml = hasSubheadings
      ? `<ul class="toc-sublist">${item.subheadings.map(renderItem).join('')}</ul>`
      : '';

    return `
      <li class="toc-item toc-level-${item.depth}">
        <a href="#${item.slug}" class="toc-link" title="${item.text}">
          ${item.text}
        </a>
        ${subheadingsHtml}
      </li>
    `;
  }

  return `<ul class="toc-list">${items.map(renderItem).join('')}</ul>`;
}
