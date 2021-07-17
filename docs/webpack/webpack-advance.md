---
sidebar: auto
---

# 1.webpack进阶

## Tapable

webpack 本质上是一种事件流的机制，它的工作流程就是将各种插件串联起来，而实现这一切的核心就是Tapable，Tapable有点类似于 nodejs 中的events库。核心原理也是依赖于发布订阅模式。

