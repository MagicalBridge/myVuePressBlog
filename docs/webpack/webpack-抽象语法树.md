---
sidebar: auto
---

# 抽象语法树

## 什么是抽象语法树?

抽象语法树英文表示为（Abstract Syntax Tree），或者一般简称为（Syntax tree），是源代码语法结构的一种抽象表示，它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

## 抽象语法树有什么用？
代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
- 如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误
- IDE 的错误提示、格式化、高亮、自动补全等等

代码混淆压缩
- UglifyJS2 等
  
优化变更代码，改变代码结构使达到想要的结构
- 代码打包工具 webpack、rollup 等等
- CommonJS、AMD、CMD、UMD 等代码规范之间的转化
- CoffeeScript、TypeScript、JSX 等转化为原生 Javascript

## JavaScript Parser
那如何将我们平时写的代码变换成抽象语法树呢？我们可以借助一些常用的工具：
- esprima
- traceur
- acorn
- shift

他们都可以称之为 `JavaScript Parser` 是能够把JavaScript源码转化为抽象语法树的解析器。

## 一个例子

我们有这样一个函数： 
```js
function ast(){}
```
经过抽象语法树解析、改变内容、重新生成源码的流程后改造后，我们想要获得：

```js
function newAst(){}
```

这样说起来可能还是有些抽象，我们借助一些在线工具[astexplorer](https://astexplorer.net/)可以简单的查看下ast的结构：

![抽象语法树](../images/webpack/03.png)

从图中我们可以看到，抽象语法树其实是一个对象，type 字段标识的是层级结构类型，里面还有一些字段，标识具体的类型、参数等等。

我们要做的就是将函数生成这样的结构，然后解析，最后返回出一个新的函数。

我们首先安装依赖: 

```bash
npm i esprima estraverse escodegen -S
```
- esprima: 这个包能将源代码生成抽象语法树
- estraverse: 这个包能遍历抽象语法树，修改树上的代码
- escodegen: 将抽象语法树，重新生成代码


```js
let esprima = require("esprima") // 把JS源代码转成AST语法树
let estraverse = require("estraverse") // 遍历语法树, 修改树上的节点
let escodegen = require("escodegen") // 把AST语法树重新转换成代码

// 源代码 是一个函数声明，函数名字为 ast
let code = `function ast(){}`
// 第一步：将源代码生成抽象语法树
let ast = esprima.parse(code)
// 缩进样式
let indent = 0
const padding = () => " ".repeat(indent)

// 调用 traverse方法遍历语法树
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入")
    // 如果是函数声明
    if (node.type === "FunctionDeclaration") {
      // 将函数的名称修改为  newAst
      node.id.name = "newAst"
    }
    indent += 2
  },
  leave(node) {
    indent -= 2
    console.log(padding() + node.type + "离开")
  },
})

// 用修改过的ast 生成新的代码
const result =  escodegen.generate(ast)

console.log(result)
```

通过打印，结合上面那张图的，我们可以看到代码处理的流程如下。
```
Program进入
  FunctionDeclaration进入
    Identifier进入
    Identifier离开
    BlockStatement进入
    BlockStatement离开
  FunctionDeclaration离开
Program离开

function newAst() {
}
```

通过上面的小例子，是不是感觉似曾相识，如果你有这种感觉就对了，这个就特别类似于我们在平时工作中使用的babel。

## 什么是babel?

简单来说，babel 能够转译`ECMAScript 2015+ `的代码，使它在旧的浏览器或者环境中也能够运行。
就像上面的小例子一样，babel的工作过程也可以分为三个部分：

- Parse(解析) 将源代码转换成抽象语法树，树上有很多的节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

我们可以用一张图展示这三个步骤：
![ast-compiler-flow](./../images/webpack/ast-compiler-flow.jpeg)

## 介绍几个babel的常用包

我们在日常开发中，但凡观察下package.json中的依赖，就肯定有这个这几个包：

- @babel/core: Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能。需要注意的是，这个包本身并不知道你想转换哪些内容，比如你是否想转换箭头函数，你是否想转换装饰器？这些能力需要安装特定的插件配合这个包使用。
- @babel/traverse: 用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点.
- @babel/generate: 可以把AST生成源码，同时生成sourcemap
- @babel/types 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用。

## 使用babel利用ast的原理转换ES6代码

既然已经知道了 babel的工作原理，我们不妨使用babel提供的工具来写一个小例子，加深理解，就拿 箭头函数为例，我们想利用babel 将箭头函数转换为普通函数。

安装依赖
```bash
npm install @babel/core babel-types babel-plugin-transform-es2015-arrow-functions -D
```

上面的安装命令中的`babel-plugin-transform-es2015-arrow-functions`就是babel的一个插件，这个插件的作用就是当源代码中匹配到箭头函数的时候，使用这个插件来转换，可以这么理解，babel/core 中提供了插件的机制，可以在解析到箭头函数的时候，调用这箭头函数插件来处理这种特定的语法格式。

```js

```







