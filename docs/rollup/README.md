---
sidebar: auto
---

# Rollup

## Rollup是什么？
Rollup 是一个 JavaScript 模块打包器，一般用于打包库文件。Rollup带有 `Tree-shaking` 的能力，使得我们的代码更加简洁清爽。

## Tree-shaking
从字面意思理解，就是"摇树", 也被称为 "live code inclusion," 它是清除实际上并没有在给定项目中使用的代码的过程，但是它可以更加高效。对于Rollup来说，它可以静态分析代码中的 import，并排除任何未曾使用的代码。

这里举一个小例子：

在使用CommonJS时候，必须导入(import)完整的工具(tool)或库(library)对象。
```js
// 使用 CommonJS 导入(import)完整的 utils 对象
var utils = require('utils');
var query = 'Rollup';
// 使用 utils 对象的 ajax 方法
utils.ajax('https://api.example.com?search=' + query).then(handleResponse);
```

但是在ES6模块时,无需导入整个utils对象，我们可以只导入(import)我们所需的 ajax 函数：
```js
// 使用 ES6 import 语句导入(import) ajax 函数
import { ajax } from 'utils';
var query = 'Rollup';
// 调用 ajax 函数
ajax('https://api.example.com?search=' + query).then(handleResponse);
```

## 使用rollup

首先确保你的电脑安装了node环境，我们使用npm就可以安装rollup。首先创建一个npm的开发环境。



### 安装学习中使用到的依赖

终端中执行下述命令：
```bash
# 新建一个文件夹
mkdir rollup-learn

# 初始化 package.json
npm init -y

# 安装rollup 依赖
npm i @babel/core @babel/preset-env  @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript lodash rollup rollup-plugin-babel postcss rollup-plugin-postcss rollup-plugin-terser tslib typescript rollup-plugin-serve rollup-plugin-livereload -D
```

### 前置知识：

常见的模块化规范:
- Asynchronous Module Definition 异步模块定义
- ES6 module是es6提出了新的模块化方案
- IIFE(Immediately Invoked Function Expression) 即立即执行函数表达式，所谓立即执行，就是声明一个函数，声明完了立即执行
- UMD全称为 Universal Module Definition 也就是通用模块定义
- cjs是nodejs采用的模块化标准，commonjs使用方法 require 来引入模块,这里 require() 接收的参数是模块名或者是模块文件的路径


### rollup的配置文件 rollup.config.js

和webpack的配置文件命名非常类似`rollup.config.js` 使用ESM的模块规范编写

```js
export default {
  input: 'src/main.js', // 入口文件
  output: {
    file: 'dist/bundle.cjs.js', // 输出文件的路径和名称
    format: 'cjs', // 五种输出格式：amd/es6/iife/umd/cjs
    name: 'rollup-bundleName' // 当format为iife和umd时必须提供，将作为全局变量挂在window下
  }
}
```

新建 src/main.js

```js
console.log('hello');
```

新建 dist\index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>rollup</title>
</head>
<body>
  <script src="./bundle.cjs.js"></script>
</body>
</html>
```

## 支持babel

为了使用新的语法，可以使用babel来进行编译输出

为了支持，babel，我们需要装babel依赖的包：

- @babel/core  babel的核心包, 所有的核心Api都在这个库里
- @babel/preset-env 这是一个预设的插件集合，包含了一组相关的插件, Bable中是通过各种插件来指导如何进行代码转换。该插件包含所有es6转化为es5的翻译规则。
- @rollup/plugin-babel  [babel插件](https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers)


> @rollup/plugin-babel 官方文档中介绍, 是rollup和babel之间一个无缝衔接的插件。

修改main.js 文件：

```js
let sum = (a,b)=>{
  return a+b;
}
let result = sum(1,2);
console.log(result);
```





