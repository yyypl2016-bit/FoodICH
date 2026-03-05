# Fore-Seen-Property 首页效果实现指南

## 目录

1. [整体布局结构](#1-整体布局结构)
2. [卡片组件设计](#2-卡片组件设计)
3. [展开/收起交互](#3-展开收起交互)
4. [动画效果](#4-动画效果)
5. [响应式设计](#5-响应式设计)
6. [配色方案](#6-配色方案)
7. [字体排版](#7-字体排版)
8. [完整代码示例](#8-完整代码示例)

---

## 1. 整体布局结构

### 1.1 页面结构概览

```
┌─────────────────────────────────────────────────────────┐
│                     Header (可选)                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Card 01 (朱榮記雜貨店)               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Card 02 (成興泰糧食)                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Card 03 (美都餐室)                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                      ...                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                     Footer (可选)                        │
└─────────────────────────────────────────────────────────┘
```

### 1.2 HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fore Seen Property</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="container">
        <!-- 卡片列表 -->
        <article class="card" data-id="01">
            <!-- 卡片内容 -->
        </article>
        
        <article class="card" data-id="02">
            <!-- 卡片内容 -->
        </article>
        
        <!-- 更多卡片... -->
    </main>
    
    <script src="main.js"></script>
</body>
</html>
```

### 1.3 CSS 容器布局

```css
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
}

.card {
    margin-bottom: 30px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 30px;
}
```

---

## 2. 卡片组件设计

### 2.1 卡片状态

每个卡片有两种状态：

```
状态一：收起状态（默认）
┌─────────────────────────────────────────────┐
│  (01)                                       │
│  Chu Wing Kee          朱榮記雜貨店          │
│  ─────────────────────────────────────────  │
│  (Sheung Wan)                               │
└─────────────────────────────────────────────┘

状态二：展开状态（点击后）
┌─────────────────────────────────────────────┐
│  (01)                                       │
│  Chu Wing Kee          朱榮記雜貨店          │
│  ─────────────────────────────────────────  │
│  (Sheung Wan)                               │
├─────────────────────────────────────────────┤
│  朱榮記雜貨店                                │
│  Chu Wing Kee                               │
│  上環水坑口街26號地下                         │
│  G/F, 26 Possession Street, Sheung Wan      │
├─────────────────────────────────────────────┤
│  朱榮記 — 日常                               │
│  文：羅宇正                                  │
│                                             │
│  「日常生活是一切事物之中心...」              │
│  [完整文章内容]                              │
├─────────────────────────────────────────────┤
│  羅宇正                                      │
│  羅宇正，研究員、編輯及翻譯...               │
└─────────────────────────────────────────────┘
```

### 2.2 卡片 HTML 结构

```html
<article class="card" data-id="01">
    <!-- 卡片头部（始终可见） -->
    <header class="card-header">
        <div class="card-number">(01)</div>
        <div class="card-title">
            <span class="title-en">Chu Wing Kee</span>
            <span class="title-zh">朱榮記雜貨店</span>
        </div>
        <div class="card-divider"></div>
        <div class="card-location">
            <span class="location-en">(Sheung Wan)</span>
        </div>
    </header>
    
    <!-- 卡片详情（默认隐藏，点击展开） -->
    <div class="card-details">
        <!-- 地址信息 -->
        <div class="card-address">
            <h3 class="shop-name-zh">朱榮記雜貨店</h3>
            <p class="shop-name-en">Chu Wing Kee</p>
            <p class="address-zh">上環水坑口街26號地下</p>
            <p class="address-en">G/F, 26 Possession Street, Sheung Wan, Hong Kong</p>
        </div>
        
        <!-- 文章内容 -->
        <div class="card-article">
            <h4 class="article-title">朱榮記 — 日常</h4>
            <p class="article-author">文：羅宇正</p>
            <div class="article-content">
                <p>「日常生活是一切事物之中心...」</p>
                <!-- 更多段落 -->
            </div>
        </div>
        
        <!-- 作者简介 -->
        <div class="card-author">
            <p class="author-name">羅宇正</p>
            <p class="author-bio">羅宇正，研究員、編輯及翻譯...</p>
        </div>
    </div>
</article>
```

### 2.3 卡片 CSS 样式

```css
/* 卡片容器 */
.card {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* 卡片头部 */
.card-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    gap: 8px 20px;
    align-items: baseline;
}

.card-number {
    grid-column: 1;
    grid-row: 1 / 3;
    font-size: 14px;
    color: #666;
    font-family: monospace;
}

.card-title {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    gap: 20px;
}

.title-en {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.title-zh {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.card-divider {
    grid-column: 1 / -1;
    grid-row: 2;
    height: 1px;
    background: #ddd;
    margin: 5px 0;
}

.card-location {
    grid-column: 3;
    grid-row: 1;
    font-size: 14px;
    color: #888;
}

/* 卡片详情（默认隐藏） */
.card-details {
    display: none;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.card.active .card-details {
    display: block;
}

/* 地址区域 */
.card-address {
    margin-bottom: 30px;
}

.shop-name-zh {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 5px;
}

.shop-name-en {
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
}

.address-zh,
.address-en {
    font-size: 14px;
    color: #888;
    line-height: 1.6;
}

/* 文章区域 */
.card-article {
    margin-bottom: 30px;
}

.article-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
}

.article-author {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
}

.article-content {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
}

.article-content p {
    margin-bottom: 15px;
    text-indent: 2em;
}

/* 作者简介 */
.card-author {
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.author-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.author-bio {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
}
```

---

## 3. 展开/收起交互

### 3.1 JavaScript 实现

```javascript
// main.js

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        
        header.addEventListener('click', function() {
            // 切换当前卡片的激活状态
            card.classList.toggle('active');
            
            // 可选：关闭其他已展开的卡片
            // cards.forEach(otherCard => {
            //     if (otherCard !== card) {
            //         otherCard.classList.remove('active');
            //     }
            // });
        });
    });
});
```

### 3.2 带动画的展开效果

```css
/* 使用 max-height 实现平滑展开 */
.card-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease, padding 0.3s ease;
    padding: 0;
}

.card.active .card-details {
    max-height: 2000px; /* 足够大的值 */
    padding-top: 20px;
    margin-top: 20px;
}
```

### 3.3 添加展开指示器

```html
<header class="card-header">
    <!-- 原有内容 -->
    <div class="expand-indicator">
        <span class="plus">+</span>
        <span class="minus">−</span>
    </div>
</header>
```

```css
.expand-indicator {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #999;
}

.expand-indicator .minus {
    display: none;
}

.card.active .expand-indicator .plus {
    display: none;
}

.card.active .expand-indicator .minus {
    display: block;
}
```

---

## 4. 动画效果

### 4.1 卡片悬停效果

```css
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.card-header:hover {
    background-color: #fafafa;
}
```

### 4.2 内容淡入效果

```css
.card-details {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.4s ease, transform 0.4s ease, max-height 0.5s ease;
}

.card.active .card-details {
    opacity: 1;
    transform: translateY(0);
}
```

### 4.3 分隔线动画

```css
.card-divider {
    position: relative;
    overflow: hidden;
}

.card-divider::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: #333;
    transition: width 0.3s ease;
}

.card:hover .card-divider::after {
    width: 100%;
}
```

---

## 5. 响应式设计

### 5.1 移动端适配

```css
/* 移动端样式 */
@media (max-width: 768px) {
    .container {
        padding: 20px 15px;
    }
    
    .card-header {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .card-number {
        grid-row: 1;
    }
    
    .card-title {
        grid-row: 2;
        flex-direction: column;
        gap: 5px;
    }
    
    .card-divider {
        grid-row: 3;
    }
    
    .card-location {
        grid-row: 4;
        grid-column: 1;
    }
    
    .title-en,
    .title-zh {
        font-size: 16px;
    }
    
    .shop-name-zh {
        font-size: 20px;
    }
    
    .article-content {
        font-size: 15px;
    }
}
```

### 5.2 平板适配

```css
@media (min-width: 769px) and (max-width: 1024px) {
    .container {
        max-width: 700px;
        padding: 30px 25px;
    }
}
```

---

## 6. 配色方案

### 6.1 推荐配色

```css
:root {
    /* 主色调 */
    --color-primary: #333333;
    --color-secondary: #666666;
    --color-muted: #888888;
    --color-light: #999999;
    
    /* 背景色 */
    --bg-primary: #ffffff;
    --bg-secondary: #fafafa;
    --bg-hover: #f5f5f5;
    
    /* 边框色 */
    --border-light: #eeeeee;
    --border-medium: #dddddd;
    --border-dark: #cccccc;
    
    /* 文字色 */
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-muted: #888888;
}
```

### 6.2 怀旧风格配色（可选）

```css
:root {
    --color-primary: #4a4a4a;
    --color-secondary: #6b6b6b;
    --color-muted: #8b8b8b;
    
    --bg-primary: #f9f7f2;
    --bg-secondary: #f5f3ed;
    --bg-hover: #f0ede5;
    
    --border-light: #e5e2d9;
    --border-medium: #d5d2c9;
}
```

---

## 7. 字体排版

### 7.1 字体选择

```css
/* 推荐字体组合 */
body {
    font-family: 
        'Noto Serif TC',           /* 中文衬线 */
        'Source Han Serif TC',     /* 思源宋体 */
        'Georgia',                 /* 英文衬线 */
        serif;
}

/* 英文/数字使用等宽字体 */
.card-number,
.title-en,
.location-en {
    font-family: 
        'JetBrains Mono',
        'Fira Code',
        'Consolas',
        monospace;
}
```

### 7.2 字体大小层级

```css
:root {
    /* 标题 */
    --font-size-h1: 24px;
    --font-size-h2: 20px;
    --font-size-h3: 18px;
    
    /* 正文 */
    --font-size-body: 16px;
    --font-size-small: 14px;
    --font-size-xs: 13px;
    
    /* 行高 */
    --line-height-tight: 1.4;
    --line-height-normal: 1.6;
    --line-height-loose: 1.8;
}
```

### 7.3 引用文字样式

```css
.article-content blockquote {
    margin: 20px 0;
    padding: 15px 20px;
    border-left: 3px solid #333;
    background: #fafafa;
    font-style: italic;
    color: #555;
}
```

---

## 8. 完整代码示例

### 8.1 完整 HTML

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fore Seen Property - 香港老店記錄</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="container">
        <!-- Card 01 -->
        <article class="card" data-id="01">
            <header class="card-header">
                <div class="card-number">(01)</div>
                <div class="card-title">
                    <span class="title-en">Chu Wing Kee</span>
                    <span class="title-zh">朱榮記雜貨店</span>
                </div>
                <div class="card-divider"></div>
                <div class="card-location">(Sheung Wan)</div>
                <div class="expand-indicator">
                    <span class="plus">+</span>
                    <span class="minus">−</span>
                </div>
            </header>
            
            <div class="card-details">
                <div class="card-address">
                    <h3 class="shop-name-zh">朱榮記雜貨店</h3>
                    <p class="shop-name-en">Chu Wing Kee</p>
                    <p class="address-zh">上環水坑口街26號地下</p>
                    <p class="address-en">G/F, 26 Possession Street, Sheung Wan, Hong Kong</p>
                </div>
                
                <div class="card-article">
                    <h4 class="article-title">朱榮記 — 日常</h4>
                    <p class="article-author">文：羅宇正</p>
                    <div class="article-content">
                        <blockquote>
                            「日常生活是一切事物之中心，藴含著文化的根源。人類的真正價值，正是最為直接地展現於日常生活中。如果我們的生活被醜陋之物所包圍，那麼，生活品質也淪為低下，心態也將在不知不覺中被扭曲，從而陷入貧乏而沒有潤澤的狀態……因此，為實際用途而製作的器物，正是使生活和美相結合的橋樑。」
                            <cite>日本美學家、民藝研究者柳宗悅《民藝之國日本》</cite>
                        </blockquote>
                        <p>飛天豬作為畫家，一開始走訪老店尋找靈感，並非因為人文關懷或對老店所屬社區的情感，而是受美學所驅使，想把其獨特的「美」在紙上展現...</p>
                    </div>
                </div>
                
                <div class="card-author">
                    <p class="author-name">羅宇正</p>
                    <p class="author-bio">羅宇正，研究員、編輯及翻譯，多年來曾參與多間機構及院校的出版和公關計畫，是飛天豬第一本作品《老店風情畫》的編輯。</p>
                </div>
            </div>
        </article>
        
        <!-- Card 02 -->
        <article class="card" data-id="02">
            <!-- 结构同上 -->
        </article>
        
        <!-- 更多卡片... -->
    </main>
    
    <script src="main.js"></script>
</body>
</html>
```

### 8.2 完整 CSS

```css
/* style.css */

/* CSS 变量 */
:root {
    --color-primary: #333333;
    --color-secondary: #666666;
    --color-muted: #888888;
    --color-light: #999999;
    
    --bg-primary: #ffffff;
    --bg-secondary: #fafafa;
    --bg-hover: #f5f5f5;
    
    --border-light: #eeeeee;
    --border-medium: #dddddd;
    
    --font-serif: 'Noto Serif TC', 'Source Han Serif TC', Georgia, serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

/* 重置样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-serif);
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-primary);
    background: var(--bg-primary);
}

/* 容器 */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
}

/* 卡片 */
.card {
    position: relative;
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--border-medium);
    cursor: pointer;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

/* 卡片头部 */
.card-header {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    grid-template-rows: auto auto;
    gap: 8px 20px;
    align-items: baseline;
    padding: 10px 0;
    transition: background 0.3s ease;
}

.card-header:hover {
    background: var(--bg-secondary);
}

.card-number {
    grid-column: 1;
    grid-row: 1 / 3;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--color-muted);
}

.card-title {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    gap: 20px;
}

.title-en {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 500;
}

.title-zh {
    font-size: 18px;
    font-weight: 500;
}

.card-divider {
    grid-column: 1 / -1;
    grid-row: 2;
    height: 1px;
    background: var(--border-medium);
    margin: 5px 0;
}

.card-location {
    grid-column: 3;
    grid-row: 1;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--color-muted);
}

.expand-indicator {
    grid-column: 4;
    grid-row: 1;
    font-size: 20px;
    color: var(--color-light);
    user-select: none;
}

.expand-indicator .minus {
    display: none;
}

.card.active .expand-indicator .plus {
    display: none;
}

.card.active .expand-indicator .minus {
    display: inline;
}

/* 卡片详情 */
.card-details {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: 
        max-height 0.5s ease,
        opacity 0.4s ease,
        transform 0.4s ease,
        padding 0.3s ease;
    padding: 0;
}

.card.active .card-details {
    max-height: 3000px;
    opacity: 1;
    transform: translateY(0);
    padding-top: 20px;
    margin-top: 10px;
    border-top: 1px solid var(--border-light);
}

/* 地址区域 */
.card-address {
    margin-bottom: 30px;
}

.shop-name-zh {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 5px;
}

.shop-name-en {
    font-family: var(--font-mono);
    font-size: 16px;
    color: var(--color-secondary);
    margin-bottom: 15px;
}

.address-zh,
.address-en {
    font-size: 14px;
    color: var(--color-muted);
    line-height: 1.6;
}

/* 文章区域 */
.card-article {
    margin-bottom: 30px;
}

.article-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
}

.article-author {
    font-size: 14px;
    color: var(--color-secondary);
    margin-bottom: 20px;
}

.article-content {
    font-size: 16px;
    line-height: 1.8;
}

.article-content p {
    margin-bottom: 15px;
    text-indent: 2em;
}

.article-content blockquote {
    margin: 20px 0;
    padding: 20px;
    border-left: 3px solid var(--color-primary);
    background: var(--bg-secondary);
    font-style: italic;
    color: var(--color-secondary);
}

.article-content blockquote cite {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    font-style: normal;
    color: var(--color-muted);
}

/* 作者简介 */
.card-author {
    padding-top: 20px;
    border-top: 1px solid var(--border-light);
}

.author-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
}

.author-bio {
    font-size: 13px;
    color: var(--color-secondary);
    line-height: 1.6;
}

/* 响应式 */
@media (max-width: 768px) {
    .container {
        padding: 20px 15px;
    }
    
    .card-header {
        grid-template-columns: 1fr auto;
        gap: 10px;
    }
    
    .card-number {
        grid-row: 1;
    }
    
    .card-title {
        grid-column: 1;
        grid-row: 2;
        flex-direction: column;
        gap: 5px;
    }
    
    .card-divider {
        grid-row: 3;
    }
    
    .card-location {
        grid-column: 1;
        grid-row: 4;
    }
    
    .expand-indicator {
        grid-column: 2;
        grid-row: 1;
    }
    
    .title-en,
    .title-zh {
        font-size: 16px;
    }
    
    .shop-name-zh {
        font-size: 20px;
    }
    
    .article-content {
        font-size: 15px;
    }
}
```

### 8.3 完整 JavaScript

```javascript
// main.js

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 切换当前卡片状态
            card.classList.toggle('active');
            
            // 平滑滚动到展开的卡片
            if (card.classList.contains('active')) {
                setTimeout(() => {
                    card.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
        });
    });
    
    // 可选：点击页面其他地方关闭所有卡片
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.card')) {
            cards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
    
    // 可选：键盘支持
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('active');
            }
        });
    });
});
```

---

## 实现要点总结

### 核心技术点

| 技术点 | 实现方式 |
|--------|----------|
| 卡片布局 | CSS Grid |
| 展开/收起 | CSS max-height + JS classList.toggle |
| 平滑动画 | CSS transition |
| 响应式 | CSS Media Queries |
| 字体排版 | Google Fonts + CSS Variables |

### 关键设计原则

1. **极简主义** - 大量留白，内容聚焦
2. **档案美学** - 编号系统营造收藏感
3. **双语呈现** - 中英文并列
4. **渐进展示** - 点击展开详情
5. **人文气息** - 衬线字体 + 深度故事

### 可扩展功能

- [ ] 搜索/筛选功能
- [ ] 分类标签
- [ ] 地图定位
- [ ] 分享按钮
- [ ] 打印优化
- [ ] 暗色模式
