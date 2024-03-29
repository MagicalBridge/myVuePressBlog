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
    name: 'rollup-bundleName' 
  }
}
```

当format为iife和umd时必须提供，将作为全局变量挂在window下。


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

添加 `.babelrc` 文件：

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ]
}
```

更新配置文件：

```js{1,10-15}
import babel from "@rollup/plugin-babel"

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
    name: "rollup-bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
  plugins: [
    babel({
      babelHelpers: 'bundled', // 这个配置babel希望被显示的配置上去
      exclude: "node_modules/**",
    }),
  ],
}
```

重新编译, 变成了普通函数。

```js
'use strict';
// 最简单的打包配置
// console.log("hello rollup");

// 使用新的语法，用babel来转义
var sum = function sum(a, b) {
  return a + b;
};
var result = sum(1, 2);
console.log(result);
```

## 使用第三方模块

rollup编译源码中的模块引用，默认只支持ESM的模块加载方式 `import/export`

### 安装依赖

```bash
npm install @rollup/plugin-node-resolve @rollup/plugin-commonjs  lodash  --save-dev
```

更新配置文件：

```js{2-3,17-18}
import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
    name: "rollup-bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
  plugins: [
    babel({
      babelHelpers: "bundled", // 这个配置babel希望被显示的配置上去
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
  ],
}

```

安装完毕之后，`src\main.js`中引用 lodash 看看效果。


## 如何使用CDN

一些类库会使用到CDN这种形式，而不是本地安装的包，这种场景下rollup也是支持的。

`src\main.js`

```js
import _ from 'lodash';
import $ from 'jquery';
console.log(_.concat([1,2,3],4,5));
console.log($);
export default 'main';
```

`dist\index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>rollup</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
  <script src="bundle.cjs.js"></script>
</body>
</html>
```

rollup.config.js

```js
import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "iife", //五种输出格式：amd/es6/iife/umd/cjs
    name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
    global: {
      lodash: "_",
      jquery: "$",
    },
  },
  external: ["lodash", "jquery"],
  plugins: [
    babel({
      babelHelpers: "bundled", // 这个配置babel希望被显示的配置上去
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
  ],
}

```

重新编译打印出来的 budle.cjs.js
```js
var bundleName = (function (_, $) {
	'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var ___default = /*#__PURE__*/_interopDefaultLegacy(_);
	var $__default = /*#__PURE__*/_interopDefaultLegacy($);

	// 最简单的打包配置
	console.log(___default["default"].concat([1, 2, 3], 4, 5));
	console.log($__default["default"]);
	var main = 'main';

	return main;

})(_, $);
```


## 如何支持typescript 并进行代码压缩

首先也是需要安装支持的插件：

```bash
npm install tslib typescript @rollup/plugin-typescript --save-dev
```

如果想要实现代码压缩，还需要使用一个插件 `terser`

```bash
npm install rollup-plugin-terser --save-dev
```

添加 tsconfig.json 文件

```js
{
  "compilerOptions": {  
    "target": "es5",                          
    "module": "ESNext",                     
    "strict": true,                         
    "skipLibCheck": true,                    
    "forceConsistentCasingInFileNames": true 
  }
}
```

`src\main.ts`

```js
let myName:string = 'name';
let age:number=12;
console.log(myName,age);
```

rollup.config.js

```js{2-3,6,17-18}
import babel from "@rollup/plugin-babel";
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: "src/main.ts",
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
    name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
  plugins: [
    babel({
      babelHelpers: "bundled", // 这个配置babel希望被显示的配置上去
      exclude: "node_modules/**",
    }),
    typescript(),
    terser()
  ],
}
```

编译出来的文件：只有一行，连变量声明都没有了，只有打印的语句

```js
"use strict";console.log("zhufeng",12);
```

## 支持启动本地服务器

安装依赖

```bash
npm install rollup-plugin-serve --save-dev
```

修改配置文件：

```js{2,13-17}
import typescript from "@rollup/plugin-typescript"
import serve from "rollup-plugin-serve"

export default {
  input: "src/main.ts",
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
    name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
  plugins: [
    typescript(),
    serve({
      open: true,
      port: 8081,
      contentBase: "./dist",
    }),
  ],
}
```

## rollup源码实现

在源码实现之前， 来准备一些前置知识。

### 1.1 初始化项目

```bash
npm install rollup magic-string acorn --save
```

### 1.2 magic-string
magic-string是一个操作字符串和生成source-map的工具

```js
let MagicString = require('magic-string');
let sourceCode = `export var name = "学习rollup"`;
let ms = new MagicString(sourceCode);
console.log(ms); // 打印的是实例

// 裁剪出原始字符串开始和结束之间所有的内容
// 返回一个克隆后的MagicString的实例
console.log(ms.snip(0, 6).toString());//sourceCode.slice(0,6);
// 删除0, 7之间的内容
console.log(ms.remove(0, 7).toString());//sourceCode.slice(7);

// 还可以用用来合并代码 
let bundle = new MagicString.Bundle();
bundle.addSource({
  content: 'var a = 1;',
  separator: '\n'
});
bundle.addSource({
  content: 'var b = 2;',
  separator: '\n'
});

console.log(bundle.toString());
```

这段代码使用了 `magic-string` 库，这是一个用于处理字符串的库，主要用于在字符串中进行插入、删除、替换等操作，特别适用于处理源代码字符串。下面对你提供的代码进行解释：

1. **创建 `MagicString` 实例：**
   ```javascript
   let MagicString = require('magic-string');
   let sourceCode = `export var name = "学习rollup"`;
   let ms = new MagicString(sourceCode);
   console.log(ms);
   ```
   - 引入 `magic-string` 库并创建了一个 `MagicString` 实例 `ms`。
   - `sourceCode` 是原始的源代码字符串。

2. **裁剪出原始字符串开始和结束之间所有的内容：**
   ```javascript
   console.log(ms.snip(0, 6).toString());
   ```
   - 使用 `snip(start, end)` 方法裁剪字符串，裁剪的范围是从索引 `start` 到索引 `end` 之间的字符。
   - 这里裁剪的范围是从索引 0 到索引 6，即裁剪 "export"。
   - `toString()` 方法用于获取裁剪后的字符串。

3. **删除 0 到 7 之间的内容：**
   ```javascript
   console.log(ms.remove(0, 7).toString());
   ```
   - 使用 `remove(start, end)` 方法删除字符串，删除的范围是从索引 `start` 到索引 `end` 之间的字符。
   - 这里删除的范围是从索引 0 到索引 7，即删除 "export "。

4. **用于合并代码的 `MagicString.Bundle`：**
   ```javascript
   let bundle = new MagicString.Bundle();
   bundle.addSource({
     content: 'var a = 1;',
     separator: '\n'
   });
   bundle.addSource({
     content: 'var b = 2;',
     separator: '\n'
   });
   console.log(bundle.toString());
   ```
   - 创建了一个 `MagicString.Bundle` 实例 `bundle`，用于合并多个源代码字符串。
   - 使用 `addSource({ content, separator })` 方法向 `bundle` 中添加源代码片段，`content` 是源代码字符串，`separator` 是每个源代码片段之间的分隔符。
   - 在这个例子中，向 `bundle` 添加了两个源代码片段，分别是 `'var a = 1;'` 和 `'var b = 2;'`，它们由换行符 `\n` 分隔。
   - `bundle.toString()` 方法用于获取合并后的字符串。

### 1.3 AST
- 通过JavaScript Parser可以把代码转化为一颗抽象语法树AST, 这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。

AST的工作流：
- Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

### 1.4 acorn

acorn 解析结果符合The Estree Spec规范，在webpack和rollup中使用的都是这个库去处理的。

`acorn` 是一个 JavaScript 解析器（Parser）库，用于将 JavaScript 代码解析为抽象语法树（AST）。这个库是由 Marijn Haverbeke 编写的，被广泛用于各种与 JavaScript 代码分析和处理相关的工具和项目中。以下是一个简单的示例，演示了如何使用 `acorn` 库来解析 JavaScript 代码：

首先，确保你已经安装了 `acorn` 库：

```bash
npm install acorn
```

然后，你可以使用以下代码来解析 JavaScript 代码：

```javascript
const acorn = require('acorn');

// 要解析的 JavaScript 代码
const code = 'const message = "Hello, Acorn!";';

// 使用 acorn 解析代码，得到 AST
const ast = acorn.parse(code, {
  ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
  sourceType: 'module',  // 解析模块代码
});

// 打印解析得到的 AST
console.log(JSON.stringify(ast, null, 2));
```
下面是使用工具生成的json结构的AST语法树。
```json
{
  "type": "Program",
  "start": 0,
  "end": 32,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 32,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 31,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 13,
            "name": "message"
          },
          "init": {
            "type": "Literal",
            "start": 16,
            "end": 31,
            "value": "Hello, Acorn!",
            "raw": "\"Hello, Acorn!\""
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

上述代码中：

1. `acorn.parse(code, options)` 方法用于将传入的 JavaScript 代码 `code` 解析成一个抽象语法树（AST）。
2. `options` 对象是可选的，用于指定解析的选项。在上面的例子中，使用了 `ecmaVersion` 设置为 `'latest'`，表示使用最新的 ECMAScript 版本，以及 `sourceType` 设置为 `'module'`，表示解析模块代码。
3. `JSON.stringify(ast, null, 2)` 用于将得到的 AST 对象格式化为漂亮的 JSON 字符串，并打印出来。

## 2. 实现rollup

### 2.1 目录结构

```
├── package.json
├── README.md
├── src
    ├── ast
    │   ├── analyse.js //分析AST节点的作用域和依赖项
    │   ├── Scope.js //有些语句会创建新的作用域实例
    │   └── walk.js //提供了递归遍历AST语法树的功能
    ├── Bundle//打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出
    │   └── index.js 
    ├── Module//每个文件都是一个模块
    │   └── index.js
    ├── rollup.js //打包的入口模块
    └── utils
        ├── map-helpers.js
        ├── object.js
        └── promise.js
```

### 2.2 src\main.js

```js
console.log('hello');
```






