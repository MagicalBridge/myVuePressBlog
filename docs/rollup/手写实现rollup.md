---
sidebar: auto
---

# 手写实现rollup

## 前置知识

### 1.1 初始化项目

```bash
npm install rollup magic-string  acorn --save
```

### 1.2 magic-string
- magic-string是一个操作字符串和生成source-map的工具

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

### 1.3 AST
- 通过JavaScript Parser可以把代码转化为一颗抽象语法树AST, 这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。

AST的工作流：
- Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码


### 1.4 acorn

acorn 解析结果符合The Estree Spec规范，在webpack和rollup中使用的都是这个库去处理的。

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









