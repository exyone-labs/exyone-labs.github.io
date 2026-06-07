---
title: Docker容器化部署实践
date: 2026-04-10
categories:
  - 项目分享
tags:
  - Docker
  - 部署
  - 教程
excerpt: 分享使用Docker进行博客项目容器化部署的实践经验，包括Dockerfile编写、多阶段构建和Docker Compose编排。
---

## 为什么选择Docker

Docker容器化部署可以解决"在我机器上能跑"的经典问题，确保开发、测试、生产环境的一致性。

## Dockerfile编写

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/_site /usr/share/nginx/html
```

## 多阶段构建

多阶段构建可以有效减小最终镜像体积。构建阶段包含所有开发依赖，运行阶段只包含产物和运行时。

## Docker Compose编排

```yaml
version: '3.8'
services:
  blog:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

## 总结

Docker容器化让部署变得可重复、可预测。结合CI/CD流水线，可以实现一键部署的自动化流程。
