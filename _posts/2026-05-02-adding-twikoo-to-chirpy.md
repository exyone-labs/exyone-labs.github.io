---
title: "Adding Twikoo Comments to Chirpy: A Plugin Development Journey"
date: 2026-04-25
categories: [Technology]
tags: [jekyll, twikoo, plugin]
lang: en-zh
---

Chirpy is an excellent theme, but it doesn't natively support Twikoo comments. I wanted to add Twikoo alongside the existing Giscus system without modifying the theme's source code. The solution evolved through multiple iterations: I started with a Jekyll plugin, then tried footer.html template injection, and finally settled on a local-build-then-push workflow to ensure consistency across all deployment platforms.

## Why Twikoo?

Giscus is great—it's free, ad-free, and stores comments in GitHub Discussions. But there's a catch: readers need a GitHub account to comment. For some friends, especially those in regions with network restrictions or those who simply don't have a GitHub account, this creates an unnecessary barrier. A reader from China, for instance, might have stable access to your blog but struggle to load GitHub's authentication page. Another reader might just want to leave a quick comment without creating yet another online account.

Twikoo offers a simpler alternative. It supports anonymous comments, requires no third-party account, and provides a lightweight commenting experience. The trade-off is that you need to host a Twikoo backend (using Tencent CloudBase, Vercel, or a self-hosted solution), but for many bloggers, this is worth the flexibility it offers readers. By offering both Giscus and Twikoo, readers can choose what works best for their situation.

## The Challenge

Chirpy uses Giscus as its comment system, configured through `_config.yml`. The theme's templates are packaged inside a Ruby gem, which means they're not directly editable in your project directory. You could fork the theme and modify it, but that creates maintenance overhead—every time the theme updates, you'd need to merge those changes into your fork.

I wanted a solution that would survive theme updates without requiring me to maintain a separate fork. The goal was to inject Twikoo into post pages without touching the theme's core files.

## The Solution: A Journey Through Multiple Approaches

My implementation went through several iterations before finding the right approach. Each method had its own limitations that led me to the next one.

### First Attempt: Post-Render Hook

I initially created a Jekyll plugin that uses a post-render hook to inject Twikoo's HTML and JavaScript into every post page after the build process completes. The hook runs after Jekyll finishes rendering each document. It checks if the output is HTML, verifies the document is a post, and injects the Twikoo container before the closing `</body>` tag.

This approach worked locally and on some hosting platforms, but I discovered that GitHub Actions' build environment handles Jekyll plugins differently. The plugin simply wouldn't execute on GitHub Pages builds, even though it worked perfectly on Cloudflare Pages and locally. After weeks of debugging—changing hook types, adding error handling, clearing caches, and trying various configurations—I realized the issue was fundamental to how GitHub Pages loads custom plugins.

> The complete source code is available in my [GitHub repository](https://github.com/exyone-labs/exyone-labs.github.io). Look for `_plugins/twikoo-inject.rb`.
{: .prompt-tip }

### Second Attempt: footer.html Template

After the plugin approach failed on GitHub Pages, I tried embedding Twikoo directly into `_includes/footer.html` using Liquid templates. This approach bypasses the plugin system entirely—since footer.html is part of the site's template files, Jekyll processes it during the normal build cycle regardless of plugin loading behavior.

The idea was sound, but the results were inconsistent. GitHub Actions' build environment handles template includes differently than other platforms. The footer include wasn't being processed consistently across different deployment scenarios, which meant the comment system would appear on some builds but not others.

### Third Attempt: Local Build Workflow

After two failed approaches, I realized the core problem: different build environments produce different results. Even with the same source code and the same Jekyll version, subtle differences in how platforms configure their build runners can lead to inconsistent output.

The solution I settled on is a local-build-then-push workflow. Instead of relying on the hosting platform to build the site, I build locally first, then push the pre-generated `_site` folder to a deployment repository. This ensures identical output regardless of which platform hosts the site—since the site is pre-built, the host only needs to serve static files without running Jekyll.

## Implementation Details

### Plugin Injection (First Attempt)

The original plugin approach uses several checks to ensure reliable injection. It checks if the output is HTML, verifies the document is a post, and prevents duplicate injection by looking for existing markers.

### Prevent Duplicate Injection

Using a unique data attribute as the marker prevents false positives when the article itself contains code examples that mention the injection target. This is a common pitfall when writing technical documentation about your own plugins.

### Toggle UI Design

Since Giscus can't be hidden (it's rendered by the theme), I created a toggle button that shows/hides the Twikoo section. The design uses a horizontal rule with centered text—a pattern commonly seen in publishing to separate different sections of content.

The toggle serves a practical purpose: it keeps the page clean for readers who don't want to comment, while making the option available for those who do. The button text changes from "展开 Twikoo 评论" (Expand Twikoo Comments) to "收起 Twikoo 评论" (Collapse Twikoo Comments) to clearly indicate the current state.

### Lazy Loading

Twikoo only initializes when the user clicks the toggle, saving resources. Without lazy loading, every page load would fetch the Twikoo JavaScript library and initialize the comment system, even if the reader never intended to leave a comment. With lazy loading, that overhead only occurs when actually needed.

## Styling Considerations

The implementation uses CSS variables (`--border-color`, `--text-muted`, `--link-color`) to match Chirpy's theme. This ensures the toggle looks consistent in both light and dark modes without requiring separate styles for each mode. If Chirpy updates its color scheme in the future, the Twikoo UI will automatically adapt.

Width is constrained to `max-width: 800px`, matching the content area. This alignment keeps the comment section visually connected to the article above it. Margins are set to `0.5rem auto 2rem auto`, providing breathing room at the top and more substantial separation at the bottom, where the footer begins.

## Configuration

Add Twikoo configuration to your `_config.yml`:

```yaml
comments:
  provider: twikoo # or giscus if you want both
  twikoo:
    env_id: https://your-twikoo-env.com
    version: 1.6.44
```

The `provider` field tells Chirpy which comment system to use for its built-in templates. Setting it to `twikoo` makes the theme render Twikoo instead of Giscus. However, since we're injecting Twikoo through footer.html, you can actually leave this as `giscus` if you want both systems available.

Make sure to add `plugins_dir` to your `_config.yml`:

```yaml
plugins_dir: _plugins
```

This ensures Jekyll loads the plugin from the `_plugins` directory. Without this line, Jekyll might not find your custom plugins, depending on how it's invoked.

## Setting Up the Local Build Workflow

The local-build-then-push workflow requires two repositories: one for your source code and one for the deployed site.

### Step 1: Create a Deployment Repository

Create a new repository on GitHub to hold your built site. This repository will contain only the contents of the `_site` folder after building. Name it something like `yourusername/yourusername.github.io` if you plan to use GitHub Pages, or simply `deploy` if you're using another host.

### Step 2: Configure the Source Repository

In your source repository (where you write posts), add the deployment repository as a remote:

```bash
git remote add deploy git@github.com:yourusername/deploy.git
```

### Step 3: Build and Push

When you want to deploy, run these commands locally:

```bash
# Build the site
bundle exec jekyll build

# Switch to the deploy repository's folder
cd _site

# Initialize git if needed, then commit and push
git add .
git commit -m "Deploy site"
git push deploy main
```

### Step 4: Automate with a Script

To make this workflow more convenient, create a deploy script:

```bash
#!/bin/bash
set -e

echo "Building Jekyll site..."
bundle exec jekyll build

cd _site

echo "Committing to deploy repository..."
git add .
git commit -m "Deploy $(date)"

echo "Pushing to deploy repository..."
git push deploy main

echo "Done!"
```

Make it executable with `chmod +x deploy.sh`, then run `./deploy.sh` whenever you want to deploy.

## Platform Compatibility

With the local build workflow, platform compatibility is no longer a concern. Since you're building locally and only pushing the output, the hosting platform simply serves static files. This works with any platform that can serve HTML files:

| Hosting Platform | Works with Local Build? | Notes |
|------------------|------------------------|-------|
| GitHub Pages | Yes | Push to yourusername.github.io |
| Cloudflare Pages | Yes | Connect the deploy repository |
| Netlify | Yes | Connect the deploy repository |
| Vercel | Yes | Connect the deploy repository |
| Any static host | Yes | Upload the _site contents |

The key advantage is that you don't need to configure build commands or Ruby versions on your hosting platform. You're not asking the platform to build anything—you're giving it ready-to-serve files.

## Why This Approach Works Better

Building locally and pushing the output solves several problems that plague platform-based builds.

First, consistency is guaranteed. When you build locally, you use the same Ruby version, the same Jekyll version, and the same gem versions every time. The output is deterministic. The files pushed to your deploy repository are exactly what you saw when you ran `jekyll build` locally.

Second, debugging becomes easier. If something looks wrong in production, you can compare the local build output with what's deployed. Since both come from the same build process, any differences must be due to the hosting platform's configuration, not the build itself.

Third, deployment is faster. Platform-based builds can take several minutes, especially if Jekyll needs to rebuild the entire site. With local building, you already have the output ready. Pushing to a git repository takes seconds, and most hosting platforms detect the new commit within seconds or minutes.

Fourth, you gain full control over the build environment. Platform build environments can change without notice—a platform might upgrade Ruby or Jekyll, or change how it configures the build runner. When you build locally, you decide when to upgrade, and you can test thoroughly before deploying.

## The Result

Now each post has two comment options, and they work identically regardless of where you host the site. Giscus appears by default, integrated into the theme's design. Twikoo is hidden by default, accessible through a toggle button at the bottom of each post. Readers can choose whichever system they prefer, or ignore both if they're just browsing.

The implementation is clean and non-invasive. It doesn't require forking the theme, doesn't complicate the deployment process, and respects Chirpy's design language. When the theme updates, the Twikoo integration continues to work without requiring any changes.

The local build workflow adds one extra step to deployment—you build locally instead of letting the platform build for you—but the trade-off is worth it. You get consistent results, faster deployments, and complete control over the build process.

## Get the Source Code

If you're interested in implementing this on your own Chirpy blog, the complete source code is available in my [GitHub repository](https://github.com/exyone-labs/exyone-labs.github.io). You'll need:

1. `_includes/footer.html` - Twikoo integration via template
2. `_plugins/twikoo-inject.rb` - Plugin injection (works on compatible platforms)
3. `_config.yml` - Twikoo configuration

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
| 2026-05-02 | Removed redundant code examples to prevent self-exclusion |
| 2026-05-07 | Tried footer.html template injection as alternative to plugin |
| 2026-05-07 | Found footer.html also inconsistent on GitHub Actions |
| 2026-05-08 | Implemented local-build-then-push workflow for consistency |

---

## 为 Chirpy 添加 Twikoo 评论：一次插件开发记录

Chirpy 是个出色的主题，但它原生不支持 Twikoo 评论。我想在现有的 Giscus 系统旁添加 Twikoo，又不想修改主题源码。解决方案经过多次迭代：一开始使用 Jekyll 插件，后来尝试 footer.html 模板注入，最终采用本地构建后推送的工作流程，以确保所有部署平台的行为完全一致。

## 为什么选择 Twikoo？

Giscus 很好——免费、无广告、评论存储在 GitHub Discussions 中。但有个问题：读者需要 GitHub 账号才能评论。对于一些朋友，尤其是网络受限地区的用户，或者单纯没有 GitHub 账号的人，这造成了不必要的障碍。比如一位来自中国的读者，可能能稳定访问你的博客，却难以加载 GitHub 的认证页面。另一位读者可能只是想留个言，不想为此再注册一个在线账号。

Twikoo 提供了更简单的替代方案。它支持匿名评论，无需第三方账号，提供轻量级的评论体验。代价是你需要自己托管一个 Twikoo 后端（可以使用腾讯云 CloudBase、Vercel 或自建方案），但对于很多博主来说，为了给读者提供灵活性，这个代价是值得的。通过同时提供 Giscus 和 Twikoo，读者可以根据自己的情况选择最合适的方式。

## 问题所在

Chirpy 使用 Giscus 作为评论系统，通过 `_config.yml` 配置。主题的模板被打包在 Ruby gem 里，这意味着你不能直接在项目目录中编辑它们。你可以 fork 主题然后修改，但这会带来维护负担——每次主题更新，你都需要把更新合并到你的 fork 中。

我想要一个能在主题更新后继续工作的方案，不需要维护单独的 fork。目标是在不触碰主题核心文件的情况下，将 Twikoo 注入到文章页面中。

## 解决方案：多次迭代的历程

我的实现经过几个阶段的迭代才找到正确的方法。每种方法都有其局限性，促使我转向下一个方法。

### 第一次尝试：后渲染钩子

我最初创建了一个 Jekyll 插件，使用后渲染钩子在构建完成后将 Twikoo 的 HTML 和 JavaScript 注入到每篇文章页面中。这个钩子在 Jekyll 完成每个文档渲染后运行。它检查输出是否为 HTML，验证文档是否为文章，然后将 Twikoo 容器注入到 `</body>` 标签之前。

这种方法在本地和某些托管平台上有效，但我发现 GitHub Actions 的构建环境处理 Jekyll 插件的方式不同。插件在 GitHub Pages 构建上根本不会执行，尽管它在 Cloudflare Pages 和本地运行良好。经过数周的调试——更改钩子类型、添加错误处理、清理缓存、尝试各种配置——我意识到问题根本在于 GitHub Pages 加载自定义插件的方式。

> 完整源码可在我的 [GitHub 仓库](https://github.com/exyone-labs/exyone-labs.github.io)中找到，文件位置是 `_plugins/twikoo-inject.rb`。
{: .prompt-tip }

### 第二次尝试：footer.html 模板

插件方法在 GitHub Pages 上失败后，我尝试使用 Liquid 模板将 Twikoo 直接嵌入到 `_includes/footer.html` 中。这种方法完全绕过了插件系统——由于 footer.html 是站点模板文件的一部分，Jekyll 在正常构建周期中会处理它，无论插件加载行为如何。

这个想法是合理的，但结果不一致。GitHub Actions 的构建环境处理模板 includes 的方式与其他平台不同。footer include 在不同部署场景中没有一致地处理，这意味着评论系统在一些构建上会出现，但在另一些上不会。

### 第三次尝试：本地构建工作流程

经过两次失败的尝试，我意识到核心问题：不同的构建环境会产生不同的结果。即使使用相同的源代码和相同的 Jekyll 版本，平台配置其构建运行器的细微差异也可能导致输出不一致。

我最终采用的解决方案是本地构建后推送工作流程。不再依赖托管平台构建站点，而是先在本地构建，然后将预生成的 `_site` 文件夹推送到部署仓库。这确保了无论在哪个平台托管，输出都完全一致——由于站点是预构建的，主机只需要提供静态文件，而不需要运行 Jekyll。

## 实现细节

### 插件注入（第一次尝试）

最初的插件方法使用多个检查来确保可靠的注入。它检查输出是否为 HTML，验证文档是否为文章，并通过查找现有标记来防止重复注入。

### 防止重复注入

使用独特的数据属性作为标记，可以避免文章本身包含提及注入目标的代码示例时出现误判。这是撰写关于自己插件的技术文档时常见的陷阱。

### 切换 UI 设计

由于 Giscus 无法隐藏（由主题渲染），我创建了一个切换按钮来显示/隐藏 Twikoo 区域。设计采用了水平分隔线配居中文字的方式——这是出版中常见的模式，用于分隔内容的不同部分。

切换按钮有实际用途：它为不想评论的读者保持页面整洁，同时为想评论的读者提供选项。按钮文字从"展开 Twikoo 评论"变为"收起 Twikoo 评论"，清楚地指示当前状态。

### 懒加载

Twikoo 只在用户点击切换按钮时才初始化，节省资源。没有懒加载的话，每次页面加载都会获取 Twikoo JavaScript 库并初始化评论系统，即使读者从未打算留言。有了懒加载，这个开销只在实际需要时才会发生。

## 样式考量

实现使用 CSS 变量（`--border-color`、`--text-muted`、`--link-color`）来匹配 Chirpy 的主题。这确保切换按钮在浅色和深色模式下都保持一致的外观，不需要为每种模式编写单独的样式。如果 Chirpy 在未来更新其配色方案，Twikoo UI 会自动适应。

宽度限制为 `max-width: 800px`，与内容区域对齐。这种对齐让评论部分在视觉上与上方的文章相连。边距设置为 `0.5rem auto 2rem auto`，顶部留出呼吸空间，底部提供更充分的分隔，因为那里是 footer 的开始位置。

## 配置

在 `_config.yml` 中添加 Twikoo 配置：

```yaml
comments:
  provider: twikoo # 如果你想同时使用两者，也可以用 giscus
  twikoo:
    env_id: https://your-twikoo-env.com
    version: 1.6.44
```

`provider` 字段告诉 Chirpy 在其内置模板中使用哪个评论系统。将其设置为 `twikoo` 会让主题渲染 Twikoo 而不是 Giscus。不过，由于我们通过 footer.html 注入 Twikoo，你实际上可以将其保留为 `giscus`，这样两个系统都可用。

确保在 `_config.yml` 中添加 `plugins_dir`：

```yaml
plugins_dir: _plugins
```

这确保 Jekyll 从 `_plugins` 目录加载插件。没有这一行，Jekyll 可能找不到你的自定义插件，具体取决于它的调用方式。

## 设置本地构建工作流程

本地构建后推送的工作流程需要两个仓库：一个用于源代码，一个用于已部署的站点。

### 步骤 1：创建部署仓库

在 GitHub 上创建一个新仓库来存放你构建好的站点。这个仓库在构建后只包含 `_site` 文件夹的内容。如果你计划使用 GitHub Pages，可以将其命名为 `yourusername/yourusername.github.io`，或者如果使用其他主机，简单命名为 `deploy`。

### 步骤 2：配置源代码仓库

在你的源代码仓库（你写文章的地方），将部署仓库添加为远程：

```bash
git remote add deploy git@github.com:yourusername/deploy.git
```

### 步骤 3：构建和推送

当你想部署时，在本地运行以下命令：

```bash
# 构建站点
bundle exec jekyll build

# 切换到 deploy 仓库的文件夹
cd _site

# 如果需要则初始化 git，然后提交和推送
git add .
git commit -m "Deploy site"
git push deploy main
```

### 步骤 4：用脚本自动化

为了使部署更方便，创建一个部署脚本：

```bash
#!/bin/bash
set -e

echo "Building Jekyll site..."
bundle exec jekyll build

cd _site

echo "Committing to deploy repository..."
git add .
git commit -m "Deploy $(date)"

echo "Pushing to deploy repository..."
git push deploy main

echo "Done!"
```

用 `chmod +x deploy.sh` 使其可执行，然后每当你想部署时运行 `./deploy.sh`。

## 平台兼容性

使用本地构建工作流程，平台兼容性不再是问题。由于你在本地构建并只推送输出，托管平台只需提供静态文件。这适用于任何可以提供 HTML 文件的平台：

| 托管平台 | 本地构建可用？ | 备注 |
|---------|--------------|------|
| GitHub Pages | 是 | 推送到 yourusername.github.io |
| Cloudflare Pages | 是 | 连接部署仓库 |
| Netlify | 是 | 连接部署仓库 |
| Vercel | 是 | 连接部署仓库 |
| 任何静态主机 | 是 | 上传 _site 内容 |

关键优势是你不需要在托管平台上配置构建命令或 Ruby 版本。你不是在要求平台构建任何东西——你给它的是准备好的文件。

## 为什么这种方法更好

在本地构建然后推送输出解决了困扰基于平台的构建的几个问题。

首先，一致性得到保证。当你在本地构建时，每次都使用相同的 Ruby 版本、相同的 Jekyll 版本和相同的 gem 版本。输出是确定性的。你推送到部署仓库的文件正是你在本地运行 `jekyll build` 时看到的文件。

其次，调试变得更容易。如果生产环境中出现问题，你可以将本地构建输出与已部署的内容进行比较。由于两者来自相同的构建过程，任何差异必定是由于托管平台的配置，而不是构建本身。

第三，部署速度更快。基于平台的构建可能需要几分钟，特别是如果 Jekyll 需要重建整个站点时。有了本地构建，你已经准备好了输出。推送到 git 仓库只需几秒钟，大多数托管平台在几秒或几分钟内检测到新提交。

第四，你获得了对构建环境的完全控制。平台的构建环境可能会在未经通知的情况下发生变化——平台可能会升级 Ruby 或 Jekyll，或更改其配置构建运行器的方式。当你在本地构建时，你决定何时升级，并且可以在部署前进行充分测试。

## 最终效果

现在每篇文章都有两个评论选项，而且无论你托管在哪里，它们的工作方式都完全一致。Giscus 默认显示，集成在主题的设计中。Twikoo 默认隐藏，通过每篇文章底部的切换按钮访问。读者可以选择自己偏好的评论系统，或者如果只是浏览的话，忽略两者。

实现干净且非侵入式。它不需要 fork 主题，不会使部署过程复杂化，尊重 Chirpy 的设计语言。当主题更新时，Twikoo 集成继续工作，不需要任何更改。

本地构建工作流程为部署增加了一个额外的步骤——你在本地构建而不是让平台为你构建——但这个权衡是值得的。你获得了一致的结果、更快的部署，以及对构建过程的完全控制。

## 获取源代码

如果你有兴趣在自己的 Chirpy 博客上实现这个功能，完整的源代码可以在我的 [GitHub 仓库](https://github.com/exyone-labs/exyone-labs.github.io)中找到。你需要：

1. `_includes/footer.html` - 通过模板的 Twikoo 集成
2. `_plugins/twikoo-inject.rb` - 插件注入（在兼容的平台上工作）
3. `_config.yml` - Twikoo 配置

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
| 2026-05-02 | 删除冗余代码示例以防止自我排除 |
| 2026-05-07 | 尝试使用 footer.html 模板注入作为插件的替代方案 |
| 2026-05-07 | 发现 footer.html 在 GitHub Actions 上也不一致 |
| 2026-05-08 | 实现本地构建后推送工作流程以确保一致性 |
