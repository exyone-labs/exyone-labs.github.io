---
title: "Jekyll and Chirpy: A Journey of Trial and Error"
date: 2026-04-25
categories: [Technology]
tags: [jekyll, chirpy, blog]
lang: en-zh
---

In [Why choose Jekyll, and why choose Chirpy](/posts/en-zh/why-jekyll-why-chirpy), I explained my reasons for choosing Jekyll and Chirpy. But truth be told, that article was written this year, not three years ago. As I mentioned in my previous post, I stumbled upon some "diaries" from three years ago in my drawer and wanted to migrate them to this blog.

Those diary entries were quite brief, though—just a sentence or two each. To add a touch of "ceremony," I polished and expanded them considerably, with perhaps a touch of fiction here and there.

---

In fact, my first Jekyll theme was [Academic Pages](https://wangjunjie-ai.github.io/posts/2025/06/academic-pages-guide/). (I referenced this article during setup, though the author seems to have two GitHub accounts. I asked about it earlier this year—most of their projects are at [wanng-ide](https://github.com/wanng-ide), while wangjunjie-ai is used for Pages.)

Why this theme? It came with comprehensive preset configurations—I could just write. After all, it's an "academic" personal homepage, designed to minimize tinkering and get straight to writing.

However, I'm just an ordinary blogger. I put considerable effort into transforming this academic blog into a regular one, but ultimately gave up—the theme had too many constraints.

For a long time after, I left GitHub and naturally stopped using GitHub Pages, turning instead to dynamic blogs (built with Halo).

Recently, the idea of returning to static blogging and creating an international blog struck me, so I picked up Jekyll again. The theme? I'd noticed Chirpy half a year ago while browsing GitHub Pages templates—clean, three-column design that matched my aesthetic perfectly. So I adopted it this year. I didn't use it last year because I was looking for something ready-to-use.

---

The first hurdle with Chirpy was URL generation. This is an international blog with articles in multiple languages, so I needed to distinguish them via language tags in URLs. Some bilingual articles don't even use standard language tags—for instance, this article's `lang` tag is `en-zh`.

What to do? I tried modifying Jekyll's `_config.yml`, but it caused build failures. I tried installing Jekyll multilingual URL support plugins from Gem packages, but they were all outdated. So I had to write my own plugin:

```ruby
# _plugins/auto-permalink.rb

Jekyll::Hooks.register :site, :pre_render do |site|
  site.posts.docs.each do |post|
    begin
      lang = post.data['lang'] || 'en'
      lang = lang.to_s.strip
      lang = 'en' if lang.empty?
      
      slug = post.data['slug']
      if slug.nil? || slug.to_s.strip.empty?
        basename = post.basename_without_ext.to_s
        slug = basename.sub(/^\d{4}-\d{2}-\d{2}-/, '')
      end
      
      slug = slug.to_s.strip
      slug = slug.gsub(/[^a-zA-Z0-9\-_]/, '-')
      slug = slug.gsub(/-+/, '-')
      slug = slug.gsub(/^-|-$/, '')
      slug = 'untitled' if slug.empty?
      
      permalink = "/posts/#{lang}/#{slug}/"
      post.data['permalink'] = permalink
      
    rescue => e
      Jekyll.logger.warn "Auto-permalink:", "Error processing post: #{e.message}"
      post.data['permalink'] = "/posts/untitled/"
    end
  end
end
```

URL problem solved. The second issue was fonts.

Many override solutions I found online didn't work for themes from Gem packages. The final solution was adding this code to `_includes/head.html`:

```html
<!-- Custom Font -->
<link href="https://hanzi.itedev.com/fonts/Source+Han+Sans+VF/result.css" rel="stylesheet">
<style>
  .content {
    font-family: 'Source Han Sans VF', 'Microsoft YaHei', 'PingFang SC', 'MiSans', sans-serif !important;
  }
</style>
```

[hanzi CDN](https://hanzi.itedev.com) is a font CDN I built myself. You can learn more about it from the homepage or my Halo blog. I used the direct head file override approach—you can customize it according to your needs.

---

The third issue was hiding posts. Initially, MiniMax told me to just add `hidden` to `tags`, but that didn't work. I thought about developing a plugin, but no matter how I modified the Ruby code, the result was always that posts couldn't be accessed via direct links—they were deleted, not hidden.

Later I discovered that Chirpy actually has built-in functionality to hide posts from the homepage. Not by adding to `tags`, but by adding `hidden: true` to the front matter. I went in a big circle for nothing—no configuration changes needed, Chirpy already had this feature.

---

## Jekyll 与 Chirpy：一段试错之旅

在 [Why choose Jekyll, and why choose Chirpy](/posts/en-zh/why-jekyll-why-chirpy) 这篇文章里，我谈及了选择 Jekyll 与 Chirpy 的缘由。但实话说，那篇文章是今年才写就的，并非三年前的旧作。正如上一篇文章所言，我在抽屉里意外翻出了三年前的"日记"，便想着将它们迁移到博客上来。

只是这些日记篇幅甚短，不过一两句话罢了。为了增添几分"仪式感"，我进行了大量润色与扩写——当然，也免不了些许虚构。

---

事实上，我最初使用的 Jekyll 主题是 [Academic Pages](https://wangjunjie-ai.github.io/posts/2025/06/academic-pages-guide/)。（搭建过程中参考了这篇文章，不过这位大佬似乎有两个 GitHub 账号，今年年初我曾问过他，他的项目大多在 [wanng-ide](https://github.com/wanng-ide) 中，而 wangjunjie-ai 则是用来搭建 Pages 的。）

为何选择这个主题？因为它预设的配置相当全面，我只管写文章便是。毕竟这是一个"学术"个人主页，设计初衷便是减少折腾、直奔主题。

然而，我不过是个普通博主。为了将这个学术博客改造成普通博客，我费了不少功夫，最终还是放弃了——这个主题的限制实在太多。

后来很长一段时间，我离开了 GitHub，自然也不再使用 GitHub Pages，转而投向动态博客的怀抱（用 Halo 搭建）。

这几天突然萌生了回归静态博客、做一个国际博客的念头，于是重拾 Jekyll。主题呢？半年前寻觅 GitHub Pages 模板时，我就注意到了 Chirpy——简洁干净的三栏式设计，深得我心。于是今年便直接采用了。去年没用，是因为当时想找的是开箱即用的模板。

---

用 Chirpy 碰到的第一颗钉子，是 URL 生成。这是一个国际博客，文章有多个语言版本，需要在 URL 中通过语言标签来区分。有些双语文章使用的还不是标准的语言标签，比如这篇文章的 `lang` 标签就是 `en-zh`。

怎么办？我尝试更改 Jekyll 的 `_config.yml` 文件，却导致生成失败。我尝试安装 Gem 包里的 Jekyll 多语言 URL 支持插件，但版本都太老了。于是只好自己写了个插件出来：

> 代码段见英文版 Section 3。
{: .prompt-info }

URL 的问题解决了，第二个问题是字体。

我在网上查到的许多覆盖方案都不适用于 Gem 包里的主题。最后的解决方案是在 `_includes/head.html` 里添加以下代码：

> 代码段见英文版 Section 3。
{: .prompt-info }

[hanzi 千字网 CDN](https://hanzi.itedev.com) 是我自己构建的字体 CDN，大家可以去网站首页或从我的 Halo 博客了解这个项目。我采用的是直接在 head 文件覆盖的方案，你们也可以根据自己的需求定制。

---

第三个问题是隐藏文章。最初 MiniMax 告诉我直接在 `tags` 里添加 `hidden` 就行，然后我发现没用。我的想法是开发一个插件，但无论怎么修改 Ruby 代码，最后的结果永远是无法从直链访问文章——文章被直接删除了，而非隐藏。

后来我发现，实际上 Chirpy 内置了在首页隐藏文章的功能。不是在 `tags` 里添加，而是在 front matter 中添加 `hidden: true` 就行。害得我绕了个大弯——根本不用改配置，Chirpy 本来就有这个功能。
