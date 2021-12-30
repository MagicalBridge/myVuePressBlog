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