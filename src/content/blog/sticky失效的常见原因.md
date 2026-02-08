---
title: "Sticky 失效的常见原因"
description: "css中Sticky 失效的常见原因"
publishDate: 2026-02-07
updatedDate: 2026-02-07
category: "前端"
tags: ["css", "前端"]
author: "止于秋水"
---

## Position: Sticky 失效的常见原因：

### 1.父元素或祖先元素有 overflow 属性
```css
overflow: hidden
overflow: auto
overflow: scroll
```
任何非 visible 的值都会破坏 sticky

### 2.缺少定位值
设置了sticky的元素没有设置设置top/bottom/left/right任何一个值

### 3.父容器高度不够
父容器没有设置一个最低高度，导致sticky元素没有滚动到可视区域外，此时sticky失效。

### 4.sticky 元素本身有问题
sicky元素本身设置了浮动，绝对定位等脱离文档流的属性，也会导致sticky失效。