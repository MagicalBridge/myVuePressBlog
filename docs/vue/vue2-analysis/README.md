---
sidebar: auto
---

# Vue2 源码解析

## 一.使用Rollup搭建开发环境

### 1.什么是Rollup?
`Rollup`是一个 JavaScript 模块打包器,可以将小块代码编译成大块复杂的代码， rollup.js更专注于Javascript类库打包 （开发应用时使用Webpack，开发库时使用Rollup）

### 2、环境搭建
安装rollup环境

```bash
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D
```

我们介绍下上面安装的这些包的作用：
这个命令安装了一系列用于 JavaScript 项目开发的 npm 包。让我为你解释每个包的作用：

1. **@babel/preset-env**: `@babel/preset-env` 是 Babel 的一个预设，它根据目标环境自动确定需要转换的语法和功能，从而使开发者不必手动配置每个转换。
2. **@babel/core**: Babel 的核心模块，负责实际的代码转换工作。它与各种插件一起工作，其中包括预设（preset）。
3. **rollup**: Rollup 是一个 JavaScript 模块打包器，用于将多个模块整合成一个或多个输出文件。它通常用于构建库或框架。
4. **rollup-plugin-babel**: Rollup 插件，用于在 Rollup 构建过程中集成 Babel，以便在打包时对代码进行转换。
5. **rollup-plugin-serve**: Rollup 插件，用于在开发过程中提供一个本地服务器。这对于在开发过程中实时查看项目变化非常有用。
6. **cross-env**: 一个用于设置跨平台环境变量的工具。它允许你在不同操作系统上使用相同的方式设置环境变量，这在脚本和命令中非常有用。



