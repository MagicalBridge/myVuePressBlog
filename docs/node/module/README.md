---
sidebar: auto
---

# 模块化

模块化之于程序，就如同细胞之于生命体，是具有特定功能的组成单元，不同的模块负责不同的工作，它们以某种方式联系在一起，共同保证程序的正常运转。本文将包含以下几个部分：
- 1 不同的模块标准以及它们之间的区别；
- 2 如何编写模块
- 3 模块打包的原理


随着`JavaScript`的发展，社区中产生了很多的模块标准，在认识这些标准的同事，也要了解背后的思想。例如，它为什么会有这个特性，或者为什么要这样去实现，这对于我们自己编写模块也有所帮助。

## CommonJS

`CommonJS` 是由`JavaScript`社区于 2009年提出的包含模块、文件、IO、控制台在内的一系列标准。在`Node.js`js的实现中采用了`CommonJS`标准的一部分，并在其基础上进行了一些调整，我们所说的`CommonJS`模块和`Node.js`.js中的实现并不完全一样，现在一般谈到`CommonJS`其实是`Node.js`的版本，而非它的原始定义。


`CommonJS`最初只为服务器设计，直到 `Browserify` -- 一个运行在`Node.js`环境下的模块打包工具，它可以将 `CommonJS`模块打包为浏览器可以单独运行的单个文件。这意味着客户端的代码也可以遵循`CommonJS`标准来编写。

不仅如此，借助`Node.js`的包管理器，npm开发者还可以获取他人的代码库，或者把自己的代码发布上去供他人使用，这种可以共享的传播的方式使的`CommonJS`在前端开发中逐渐流行起来。

### 模块
`CommonJS` 中规定每一个文件是一个模块。将一个`JavaScript`文件直接通过script标签插入页面中与封装成`CommonJS`模块最大的不同在于，前者的顶层作用域是全局作用域，在进行变量声明时会污染全局作用域；而后者会形成一个属于模块自身的作用域，所有的变量以及函数只有自己能够访问，对外是不可见的：

```js
// calculator.js
var name = 'calculater.js';

// index.js
var name = 'index.js';
require('./calculater.js');
console.log(name); // index.js
```

这里有两个文件，在index.js 中我们通过 CommonJS 的require函数加载 calculater.js运行之后控制台结果是 'index.js'，这说明 calculater.js中的变量声明并不会影响 index.js, 可见每一个模块是拥有各自作用域的。

