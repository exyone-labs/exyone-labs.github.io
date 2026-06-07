# Exyone Blog

一个基于 [Eleventy](https://www.11ty.dev/) 构建的现代化个人博客主题。

## 特性

- **干净简洁**：三栏式布局，半透明玻璃卡片设计
- **暗色模式**：跟随系统偏好自动切换深色/浅色主题
- **果冻绿色调**：以 `#2dd4a8` 为主色的柔和配色方案
- **代码高亮**：基于 Eleventy 官方插件 + PrismJS 的构建时语法高亮
- **响应式**：桌面三栏 → 平板两栏 → 移动端单栏适配
- **装饰效果**：噪点纹理、鼠标光晕、卡片入场动画

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（热重载）
npm run serve

# 构建生产产物
npm run build
```

构建产物输出到 `_site/` 目录。

## 项目结构

```
src/
├── _data/           # 全局数据文件
├── _includes/       # 模板组件
├── _layouts/        # 布局模板
├── _posts/          # 博客文章
├── pages/           # 独立页面
├── assets/          # 静态资源
│   ├── css/         # 样式文件
│   ├── js/          # JavaScript
│   └── images/      # 图片
└── media/           # 文章配图
```

## 许可证

BSD 2-Clause License. 详见 [LICENSE](./LICENSE) 文件。
