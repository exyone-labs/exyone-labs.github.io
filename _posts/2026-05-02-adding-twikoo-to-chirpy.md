---
title: "Adding Twikoo Comments to Chirpy: A Plugin Development Journey"
date: 2026-04-25
categories: [Technology]
tags: [jekyll, twikoo, plugin]
lang: en-zh
---

Chirpy is an excellent theme, but it doesn't natively support Twikoo comments. I wanted to add Twikoo alongside the existing Giscus system without modifying the theme's source code. The solution? A custom Jekyll plugin.

## Why Twikoo?

Giscus is great—it's free, ad-free, and stores comments in GitHub Discussions. But there's a catch: readers need a GitHub account to comment. For some friends, especially those in regions with network restrictions or those who simply don't have a GitHub account, this creates an unnecessary barrier.

Twikoo offers a simpler alternative. It supports anonymous comments, requires no third-party account, and provides a lightweight commenting experience. By offering both options, readers can choose what works best for them.

## The Challenge

Chirpy uses Giscus as its comment system, configured through `_config.yml`. But I wanted to offer readers a choice—some prefer Giscus (GitHub-based), others might prefer Twikoo (more lightweight, no GitHub account required).

The problem: Chirpy doesn't have a built-in toggle for multiple comment systems. The theme's templates are locked in the Gem package, making direct modification impractical.

## The Solution: Post-Render Hook

Jekyll provides a powerful hook system that allows plugins to modify content after rendering. I created a plugin that injects Twikoo's HTML and JavaScript into every post page after the build process completes.

```ruby
# _plugins/twikoo-inject.rb

Jekyll::Hooks.register :documents, :post_render do |document|
  inject_twikoo_comment(document)
end
```

The hook runs after Jekyll finishes rendering each document. It checks if the document is a post and injects the Twikoo container before the closing `</body>` tag.

## Implementation Details

The plugin does three things:

**1. Target Only Posts**

Not every page needs comments. The plugin checks if the document belongs to the `posts` collection:

```ruby
is_post = document.is_a?(Jekyll::Document) && 
          document.collection && 
          document.collection.label == 'posts'
return unless is_post
```

**2. Create a Toggle UI**

Since Giscus can't be hidden (it's rendered by the theme), I created a toggle button that shows/hides the Twikoo section:

```html
<div style="display: flex; justify-content: center; align-items: center; gap: 1.5rem;">
  <span style="height: 1px; flex: 1; background: var(--border-color);"></span>
  <a id="twikoo-toggle-btn" href="javascript:void(0)">展开 Twikoo 评论</a>
  <span style="height: 1px; flex: 1; background: var(--border-color);"></span>
</div>
```

The design uses a horizontal rule with centered text—a clean, minimal approach that doesn't clash with Chirpy's aesthetic.

**3. Lazy Load Twikoo**

Twikoo only initializes when the user clicks the toggle, saving resources:

```javascript
var twikooLoaded = false;
btn.addEventListener('click', function() {
  if (!twikooLoaded) {
    twikoo.init({
      envId: 'https://comments.exyone.us.kg/',
      el: '#tcomment',
      path: location.pathname,
      lang: document.documentElement.lang || 'en'
    });
    twikooLoaded = true;
  }
});
```

## Styling Considerations

The plugin uses CSS variables (`--border-color`, `--text-muted`, `--link-color`) to match Chirpy's theme. This ensures the toggle looks consistent in both light and dark modes.

Width is constrained to `max-width: 800px`, matching the content area. Margins are carefully tuned to maintain visual hierarchy without feeling cramped.

## The Result

Now each post has two comment options:
- **Giscus** (default, shown immediately)
- **Twikoo** (hidden by default, toggle to show)

Readers can choose whichever system they prefer. The implementation is clean, non-invasive, and respects the theme's design language.

## Get the Source Code

If you're interested in implementing this on your own Chirpy blog, the complete plugin source code is available in my Git repositories. You can find it on [GitHub](https://github.com/exyone-labs/exyone-labs.github.io) or any other platform where I host this blog. Look for `_plugins/twikoo-inject.rb`.

## Changelog

| Date | Changes |
|------|---------|
| 2026-04-25 | Initial release with toggle UI, lazy loading, and CSS variable support |
| 2026-04-25 | Changed hook from `:site, :post_render` to `:documents, :post_render` for better compatibility |

---

## 为 Chirpy 添加 Twikoo 评论：一次插件开发记录

Chirpy 是个出色的主题，但它原生不支持 Twikoo 评论。我想在现有的 Giscus 系统旁添加 Twikoo，又不想修改主题源码。解决方案？写一个 Jekyll 插件。

## 为什么选择 Twikoo？

Giscus 很好——免费、无广告、评论存储在 GitHub Discussions 中。但有个问题：读者需要 GitHub 账号才能评论。对于一些朋友，尤其是网络受限地区的用户，或者单纯没有 GitHub 账号的人，这造成了不必要的障碍。

Twikoo 提供了更简单的替代方案。它支持匿名评论，无需第三方账号，提供轻量级的评论体验。通过同时提供两种选择，读者可以根据自己的情况选择最合适的方式。

## 问题所在

Chirpy 使用 Giscus 作为评论系统，通过 `_config.yml` 配置。但我想给读者一个选择——有人喜欢 Giscus（基于 GitHub），有人可能更喜欢 Twikoo（更轻量，无需 GitHub 账号）。

问题在于：Chirpy 没有内置的多评论系统切换功能。主题的模板被锁定在 Gem 包里，直接修改不太现实。

## 解决方案：Post-Render 钩子

Jekyll 提供了强大的钩子系统，允许插件在渲染后修改内容。我创建了一个插件，在构建完成后将 Twikoo 的 HTML 和 JavaScript 注入到每篇文章页面中。

_代码段见英文版 Section 3。_

这个钩子在 Jekyll 完成每个文档渲染后运行。它检查文档是否为文章，并在 `</body>` 标签之前注入 Twikoo 容器。

## 实现细节

插件做了三件事：

**1. 只针对文章页面**

不是每个页面都需要评论。插件检查文档是否属于 `posts` 集合：

_代码段见英文版 Section 4.1。_

**2. 创建切换 UI**

由于 Giscus 无法隐藏（由主题渲染），我创建了一个切换按钮来显示/隐藏 Twikoo 区域：

_代码段见英文版 Section 4.2。_

设计采用了水平分隔线配居中文字的方式——简洁、克制，不会与 Chirpy 的美学冲突。

**3. 懒加载 Twikoo**

Twikoo 只在用户点击切换按钮时才初始化，节省资源：

_代码段见英文版 Section 4.3。_

## 样式考量

插件使用 CSS 变量（`--border-color`、`--text-muted`、`--link-color`）来匹配 Chirpy 的主题。这确保了切换按钮在浅色和深色模式下都保持一致的外观。

宽度限制为 `max-width: 800px`，与内容区域对齐。边距经过精心调整，保持视觉层次感而不显得拥挤。

## 最终效果

现在每篇文章都有两个评论选项：
- **Giscus**（默认显示）
- **Twikoo**（默认隐藏，点击切换显示）

读者可以选择自己偏好的评论系统。实现干净、非侵入式，尊重主题的设计语言。

## 获取源代码

如果你有兴趣在自己的 Chirpy 博客上实现这个功能，完整的插件源代码可以在我的 Git 仓库中找到。你可以在 [GitHub](https://github.com/exyone-labs/exyone-labs.github.io) 或其他我托管博客的平台查看。文件位置是 `_plugins/twikoo-inject.rb`。

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-04-25 | 初始版本，包含切换 UI、懒加载、CSS 变量支持 |
| 2026-04-25 | 将钩子从 `:site, :post_render` 改为 `:documents, :post_render` 以提高兼容性 |
