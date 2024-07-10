# pig-ui

## 概述

**pig-ui** 是一个为 PIGCLOUD 微服务开发平台开发的前端项目。它利用了现代 Web 技术，包括 Vue.js 3、Element Plus 和 Vite，提供了一个健壮且高效的开发环境。

## 功能特性

- **Vue 3**: 利用最新版本的 Vue.js 实现现代化的响应式体验。
- **Element Plus**: 集成了 Element Plus，提供丰富的 UI 组件。
- **Vite**: 使用 Vite 进行快速构建和模块热替换。
- **TypeScript**: 支持 TypeScript，提升代码质量和可维护性。
- **Tailwind CSS**: 使用 Tailwind CSS 进行样式设计。

## 快速开始

### 先决条件

- **Node.js**: 版本 18.0.0。
- **npm**: 版本 8.0.0 或更高。

### 安装
1. 克隆仓库：

```bash
git clone https://gitee.com/log4j/pig-ui.git
cd pig-ui
```

2. 安装依赖：

```bash
npm install  --registry=https://registry.npmmirror.com
```

### 开发

```bash
npm run dev
```

### 构建

为生产环境构建项目：
```bash
npm run build
```

为 Docker 构建项目：
```bash
npm run build:docker
```

## 浏览器支持

- 现代浏览器的最后两个版本。
- 不支持 IE 11 及更低版本。

## 贡献
欢迎贡献！在开始之前，请阅读[贡献指南](https://www.yuque.com/pig4cloud/pig/lceu0v)。

## 许可证
本项目采用 Apache-2.0 许可证。

## 问题和反馈
如果遇到任何问题，请在 [PIGCLOUD 问题追踪](https://gitee.com/log4j/pig/issues)上报告。
