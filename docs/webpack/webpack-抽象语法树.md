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

