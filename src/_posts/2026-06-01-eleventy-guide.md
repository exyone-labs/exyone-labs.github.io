---
title: 用Eleventy搭建静态博客的完整指南
date: 2026-06-01
updated: 2026-06-02
categories:
  - 技术笔记
tags:
  - Eleventy
  - 静态站点
  - 教程
excerpt: 本文详细介绍了如何使用Eleventy静态站点生成器搭建一个现代化的博客系统，从项目初始化到主题开发，涵盖目录结构、模板引擎、数据文件等核心概念。
---

## 为什么选择Eleventy

Eleventy（简称11ty）是一个简单而强大的静态站点生成器。与Hexo、Hugo等框架不同，Eleventy不强制使用特定的模板引擎或项目结构，给予开发者最大的自由度。

### Eleventy的优势

- **零配置起步**：开箱即用，无需复杂配置
- **多模板引擎**：支持Nunjucks、Liquid、Handlebars等
- **构建速度快**：纯JavaScript实现，构建效率高
- **灵活的数据目录**：通过`_data`目录管理全局数据

## 项目结构

一个典型的Eleventy博客项目结构如下：

```
src/
├── _data/          # 全局数据
├── _includes/      # 模板组件
│   ├── layouts/    # 布局模板
│   └── partials/   # 局部模板
├── css/            # 样式文件
├── posts/          # 博客文章
├── categories/     # 分类页面
├── tags/           # 标签页面
└── index.njk       # 首页
```

## 开始搭建

首先安装Eleventy：

```bash
npm install @11ty/eleventy --save-dev
```

然后在项目根目录创建`.eleventy.js`配置文件，定义输入输出目录和自定义过滤器。

## 模板引擎选择

Eleventy支持多种模板引擎，推荐使用**Nunjucks**，因为它功能丰富且语法直观：

```njk
---
layout: base.njk
title: Hello World
---
<h1>{{ title }}</h1>
```

## 数据驱动

Eleventy的数据文件可以放在`_data`目录中，支持JSON、JS、YAML等多种格式：

```json
{
  "site": {
    "title": "My Blog",
    "description": "A simple blog"
  }
}
```

## 结语

Eleventy的灵活性和简洁性使其成为构建静态博客的理想选择。通过合理的项目结构设计，可以搭建出既美观又高效的博客系统。
