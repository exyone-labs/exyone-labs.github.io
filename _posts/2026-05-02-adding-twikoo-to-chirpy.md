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

> The complete source code is available in my [GitHub repository](https://github.com/exyone-labs/exyone-labs.github.io). Look for `_plugins/twikoo-inject.rb`.
{: .prompt-tip }

The hook runs after Jekyll finishes rendering each document. It injects the Twikoo container before the closing `</body>` tag.

## Implementation Details

### 1. Ensure HTML Output

The first check ensures we only process HTML output (not other formats like JSON or XML).

### 2. Verify Document is a Post

We explicitly check if the document belongs to the posts collection.

> This three-part check ensures the document is a valid Jekyll Document with a collection that's specifically the 'posts' collection. It's more robust than relying on hook type alone.
{: .prompt-info }

### 3. Prevent Duplicate Injection

Check for existing marker to prevent injecting twice.

> Using a unique data attribute as marker prevents false positives when the article itself contains code examples that mention the injection target. This is a common pitfall when writing technical documentation about your own plugins.
{: .prompt-tip }

### 4. Create a Toggle UI

Since Giscus can't be hidden (it's rendered by the theme), I created a toggle button that shows/hides the Twikoo section.

The design uses a horizontal rule with centered text—a clean, minimal approach that doesn't clash with Chirpy's aesthetic.

### 5. Lazy Load Twikoo

Twikoo only initializes when the user clicks the toggle, saving resources.

> Lazy loading improves page performance by deferring non-critical resources until they're actually needed.
{: .prompt-info }

## Styling Considerations

The plugin uses CSS variables (`--border-color`, `--text-muted`, `--link-color`) to match Chirpy's theme. This ensures the toggle looks consistent in both light and dark modes.

Width is constrained to `max-width: 800px`, matching the content area. Margins are carefully tuned to maintain visual hierarchy without feeling cramped.

## Configuration

Make sure to add `plugins_dir` to your `_config.yml`:

```yaml
plugins_dir: _plugins
```

This ensures Jekyll loads plugins from the `_plugins` directory.

## Build Environment Considerations

> GitHub Actions' default build environment differs from Cloudflare Pages, which may cause Jekyll plugins to behave differently.
{: .prompt-warning }

During development, I discovered that the same plugin works perfectly on Cloudflare Pages but may fail on GitHub Pages. The root cause lies in the build environment differences:

| Aspect | GitHub Actions (Default) | Cloudflare Pages |
|--------|--------------------------|------------------|
| OS | Ubuntu Latest (Rolling) | Ubuntu 22.04.2 |
| Ruby Manager | ruby/setup-ruby | asdf |
| Ruby Version | Latest Stable | 3.4.4 (Default) |
| Plugin Loading | May vary | Consistent |

### But Wait—Does GitHub Pages Really Need Twikoo?

> Here's an interesting realization: if a visitor is browsing your site on GitHub Pages, they can already use Giscus with their GitHub account.
{: .prompt-tip }

Think about it:

1. **GitHub Pages visitors have GitHub accounts** (or at least access to GitHub)
2. **Giscus works perfectly with GitHub accounts**
3. **Twikoo is designed for users without GitHub accounts**

So the "problem" of Twikoo not working on GitHub Pages isn't really a problem at all—it's actually redundant! The only scenario where Twikoo adds value is when your site is deployed on platforms like Cloudflare Pages or Netlify, where visitors might not have GitHub accounts.

**Conclusion**: If you're only deploying to GitHub Pages, you don't need Twikoo. Giscus alone is sufficient. Twikoo only makes sense for multi-platform deployments.

### Recommended Solution

If you need Twikoo (deploying to Cloudflare Pages or Netlify), I recommend:

**Use Cloudflare Pages (Recommended)**

Cloudflare Pages provides a stable, well-tested build environment for Jekyll. Simply connect your repository and configure:

- Build command: `bundle exec jekyll build`
- Build output: `_site`
- Ruby version: Set via `RUBY_VERSION` environment variable

> Cloudflare Pages offers excellent free tier with unlimited bandwidth, global CDN, and automatic SSL. It's an excellent choice for Jekyll sites.
{: .prompt-tip }

## A Frustrating Debugging Journey

> This section documents the actual issues I encountered. If you're only interested in the solution, feel free to skip ahead.
{: .prompt-info }

After the plugin worked locally, I deployed to GitHub Pages—and nothing happened. The plugin simply didn't execute. Here's what I tried:

### What I Attempted

1. **Changed hook types**: `:site, :post_render` → `:documents, :post_render` → `:posts, :post_render`
2. **Added error handling**: Wrapped everything in `begin/rescue` blocks with logging
3. **Modified GitHub Actions workflow**: Switched from asdf to `ruby/setup-ruby`
4. **Added verbose output**: `jekyll build --verbose` to see what's happening
5. **Cleared caches**: Deleted `_site`, `.jekyll-cache`, `.jekyll-metadata` multiple times
6. **Tried `plugins_dir` configuration**: Added and removed it from `_config.yml`

### What Went Wrong

- Adding `plugins_dir: _plugins` caused dependency conflicts
- Removing it meant the plugin wouldn't load at all
- The build would succeed, but the injected HTML was nowhere to be found
- Local builds worked perfectly; Cloudflare Pages builds worked perfectly; GitHub Actions builds... didn't

### The Resolution

After hours of frustration, I realized something important: **GitHub Pages doesn't need Twikoo anyway**. Visitors browsing a GitHub Pages site can use Giscus with their GitHub accounts. The plugin works perfectly on Cloudflare Pages and Netlify—platforms where Twikoo actually adds value.

> Sometimes the best solution is to recognize when a "problem" isn't actually a problem. For GitHub Pages, Giscus alone is sufficient.
{: .prompt-tip }

## The Result

Now each post has two comment options (on Cloudflare Pages and Netlify):
- **Giscus** (default, shown immediately)
- **Twikoo** (hidden by default, toggle to show)

Readers can choose whichever system they prefer. The implementation is clean, non-invasive, and respects the theme's design language.

## Get the Source Code

If you're interested in implementing this on your own Chirpy blog, the complete plugin source code is available in my [GitHub repository](https://github.com/exyone-labs/exyone-labs.github.io). Look for `_plugins/twikoo-inject.rb`.

> If you're only deploying to GitHub Pages, you don't need this plugin—Giscus alone is sufficient. This plugin is only useful for multi-platform deployments (Cloudflare Pages, Netlify, etc.).
{: .prompt-tip }

## Changelog

| Date | Changes |
|------|---------|
| 2026-04-25 | Initial release with toggle UI, lazy loading, and CSS variable support |
| 2026-04-25 | Changed hook from `:site, :post_render` to `:documents, :post_render` for better compatibility |
| 2026-05-02 | Added explicit post collection check for reliable targeting |
| 2026-05-02 | Added `plugins_dir` configuration requirement |
| 2026-05-02 | Added build environment comparison and Cloudflare Pages recommendation |
| 2026-05-02 | Updated GitHub Actions workflow with verbose build output for debugging |
| 2026-05-02 | Fixed self-exclusion bug by using unique data attribute as marker |
| 2026-05-02 | Removed redundant code examples to prevent self-exclusion; added note that GitHub Pages doesn't need Twikoo |

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

> 完整源码可在我的 [GitHub 仓库](https://github.com/exyone-labs/exyone-labs.github.io)中找到，文件位置是 `_plugins/twikoo-inject.rb`。
{: .prompt-tip }

这个钩子在 Jekyll 完成每个文档渲染后运行，在 `</body>` 标签之前注入 Twikoo 容器。

## 实现细节

### 1. 确保为 HTML 输出

第一个检查确保我们只处理 HTML 输出（而非 JSON 或 XML 等其他格式）。

### 2. 验证文档为文章

我们显式检查文档是否属于 posts 集合。

> 这个三重检查确保文档是有效的 Jekyll Document，并且其集合明确为 'posts'。这比单纯依赖钩子类型更健壮。
{: .prompt-info }

### 3. 防止重复注入

检查现有标记以防止重复注入。

> 使用独特的 data 属性作为标记，可以避免文章内容中包含代码示例时出现误判。这是撰写技术文档时常见的一个陷阱。
{: .prompt-tip }

### 4. 创建切换 UI

由于 Giscus 无法隐藏（由主题渲染），我创建了一个切换按钮来显示/隐藏 Twikoo 区域。

设计采用了水平分隔线配居中文字的方式——简洁、克制，不会与 Chirpy 的美学冲突。

### 5. 懒加载 Twikoo

Twikoo 只在用户点击切换按钮时才初始化，节省资源。

> 懒加载通过延迟加载非关键资源直到实际需要时，提高页面性能。
{: .prompt-info }

## 样式考量

插件使用 CSS 变量（`--border-color`、`--text-muted`、`--link-color`）来匹配 Chirpy 的主题。这确保了切换按钮在浅色和深色模式下都保持一致的外观。

宽度限制为 `max-width: 800px`，与内容区域对齐。边距经过精心调整，保持视觉层次感而不显得拥挤。

## 配置

确保在 `_config.yml` 中添加 `plugins_dir`：

```yaml
plugins_dir: _plugins
```

这确保 Jekyll 从 `_plugins` 目录加载插件。

## 构建环境注意事项

> GitHub Actions 的默认构建环境与 Cloudflare Pages 不同，可能导致 Jekyll 插件行为不一致。
{: .prompt-warning }

开发过程中，我发现同一个插件在 Cloudflare Pages 上完美运行，但在 GitHub Pages 上可能失败。根本原因在于构建环境的差异：

| 方面 | GitHub Actions（默认） | Cloudflare Pages |
|------|------------------------|------------------|
| 操作系统 | Ubuntu Latest（滚动更新） | Ubuntu 22.04.2 |
| Ruby 管理器 | ruby/setup-ruby | asdf |
| Ruby 版本 | 最新稳定版 | 3.4.4（默认） |
| 插件加载 | 可能不一致 | 稳定一致 |

### 等等——GitHub Pages 真的需要 Twikoo 吗？

> 这是一个有趣的发现：如果访客在 GitHub Pages 上浏览你的网站，他们已经可以用 GitHub 账号使用 Giscus 了。
{: .prompt-tip }

仔细想想：

1. **GitHub Pages 的访客有 GitHub 账号**（或至少能访问 GitHub）
2. **Giscus 用 GitHub 账号就能正常工作**
3. **Twikoo 是为没有 GitHub 账号的用户设计的**

所以"Twikoo 在 GitHub Pages 上不工作"这个问题，其实根本不是问题——它本来就是多余的！Twikoo 唯一有价值的场景是当你的网站部署在 Cloudflare Pages 或 Netlify 等平台上，那里的访客可能没有 GitHub 账号。

**结论**：如果你只部署到 GitHub Pages，不需要 Twikoo。Giscus 单独就足够了。Twikoo 只对多平台部署有意义。

### 推荐方案

如果你需要 Twikoo（部署到 Cloudflare Pages 或 Netlify），我推荐：

**使用 Cloudflare Pages（推荐）**

Cloudflare Pages 为 Jekyll 提供了稳定、经过充分测试的构建环境。只需连接你的仓库并配置：

- 构建命令：`bundle exec jekyll build`
- 输出目录：`_site`
- Ruby 版本：通过 `RUBY_VERSION` 环境变量设置

> Cloudflare Pages 提供优秀的免费套餐，包含无限带宽、全球 CDN 和自动 SSL。是 Jekyll 站点的绝佳选择。
{: .prompt-tip }

## 一次糟糕的调试经历

> 本节记录了我遇到的实际问题。如果你只关心解决方案，可以跳过这一节。
{: .prompt-info }

插件在本地运行正常后，我部署到 GitHub Pages——然后什么都没发生。插件根本没有执行。以下是我尝试过的方法：

### 我尝试过的方法

1. **更改钩子类型**：`:site, :post_render` → `:documents, :post_render` → `:posts, :post_render`
2. **添加错误处理**：用 `begin/rescue` 块包装所有内容并添加日志
3. **修改 GitHub Actions 工作流**：从 asdf 切换到 `ruby/setup-ruby`
4. **添加详细输出**：`jekyll build --verbose` 查看发生了什么
5. **清理缓存**：多次删除 `_site`、`.jekyll-cache`、`.jekyll-metadata`
6. **尝试 `plugins_dir` 配置**：在 `_config.yml` 中添加和移除它

### 出了什么问题

- 添加 `plugins_dir: _plugins` 导致依赖冲突
- 移除它意味着插件根本不会加载
- 构建成功，但注入的 HTML 无处可寻
- 本地构建完美运行；Cloudflare Pages 构建完美运行；GitHub Actions 构建...不行

### 解决方案

经过数小时的挫折，我意识到一个重要的事实：**GitHub Pages 本来就不需要 Twikoo**。在 GitHub Pages 上浏览的访客可以用 GitHub 账号使用 Giscus。插件在 Cloudflare Pages 和 Netlify 上工作完美——这些才是 Twikoo 真正有价值的平台。

> 有时最好的解决方案是认识到"问题"根本不是问题。对于 GitHub Pages，Giscus 单独就足够了。
{: .prompt-tip }

## 最终效果

现在每篇文章都有两个评论选项（在 Cloudflare Pages 和 Netlify 上）：
- **Giscus**（默认显示）
- **Twikoo**（默认隐藏，点击切换显示）

读者可以选择自己偏好的评论系统。实现干净、非侵入式，尊重主题的设计语言。

## 获取源代码

如果你有兴趣在自己的 Chirpy 博客上实现这个功能，完整的插件源代码可以在我的 [GitHub 仓库](https://github.com/exyone-labs/exyone-labs.github.io)中找到，文件位置是 `_plugins/twikoo-inject.rb`。

> 如果你只部署到 GitHub Pages，不需要这个插件——Giscus 单独就足够了。这个插件只对多平台部署（Cloudflare Pages、Netlify 等）有意义。
{: .prompt-tip }

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-04-25 | 初始版本，包含切换 UI、懒加载、CSS 变量支持 |
| 2026-04-25 | 将钩子从 `:site, :post_render` 改为 `:documents, :post_render` 以提高兼容性 |
| 2026-05-02 | 添加显式文章集合检查，确保可靠定位 |
| 2026-05-02 | 添加 `plugins_dir` 配置要求 |
| 2026-05-02 | 添加构建环境对比及 Cloudflare Pages 推荐说明 |
| 2026-05-02 | 更新 GitHub Actions 工作流，添加详细构建输出用于调试 |
| 2026-05-02 | 修复自我排除 Bug，使用独特的 data 属性作为标记 |
| 2026-05-02 | 删除冗余代码示例以防止自我排除；添加 GitHub Pages 不需要 Twikoo 的说明 |
