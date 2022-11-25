---
sidebar: auto
---

# 微前端

## 为什么wpm要使用systemjs作为底层的加载模块
如果我们想要实现加载远程代码模块的能力，一个方案是使用amd的模块化规范，一种就是使用systemjs的规范，而systemjs显然更加具有优势。


## systemjs 实现原理
我们在使用webpack打包构建项目的时候，output输出选项中的`libraryTarget`字段设置为`system`格式，这样才能提供给别人使用。
systemjs本身就是具备加载远程链接的能力。

如果我们想要提取公共的模块，可以在external这个选项中配置 `react react-dom`, 这样，打包时候就不会将这两个库打包到dist中。

那react 和 react-dom 如何加载呢？我们可以基于systemjs的特性。可以配置一个import-maps, 将我们需要的react 和 react-dom 通过 cdn的形式引用进来。这样就能明显的减少体积。

对于systemjs来说，会首先注册两个模块，这两个模块加载完毕后，会调用回调函数返回对象中的setters，一一调用，加载完毕后会执行execute，此方法就是index.js





