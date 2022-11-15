---
sidebar: auto
---

# webpack loader

## 开发 loader

webpack 周边社区已经有相当丰富的 loader 资源可用，大部分情况我们都可以找到所需的 loader，但是总有可能遇上有构建需求是需要处理特殊的文件类型，或者社区 loader 出现某些问题并不适合你的开发项目，这个时候就需要开发一个 loader 来满足需求了。

## 准备开发

在开始开发 loader 之前，我们先准备好调试 loader 的开发环境。

我们可以在 webpack 配置中直接使用路径来指定使用本地的 loader，或者在 loader 路径解析中加入本地开发 loader 的目录。看看配置例子：

```js

```