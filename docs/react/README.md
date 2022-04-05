---
sidebar: auto
---

# React

## 1、什么是React
React是一个用于构建用户界面的JavaScript库，核心专注于视图，目的是为了实现组件化开发

## 2、组件化的概念
我们可以很直观的将一个复杂的页面 分割成若干个独立组件，每个组件包含自己的逻辑和样式，再将这些独立组件组合完成一个复杂的页面，这样既减少了逻辑复杂度，又实现了代码的复用
::: tip
- 可组合：一个组件可以和其他组件一起使用或者可以直接嵌套在另一个组件内部。
- 可重用：每个组件都是具有独立功能的，它可以被使用在多个场景中。
- 可维护：每个小的组件仅仅包含自身的逻辑，更容易被理解和维护。
:::
## 3、搭建React开发环境

```bash
npm i create-react-app -g
create-react-app react-project
cd react-project
npm start
```

## 4、JSX

### 4.1 什么是JSX
- 是一种JS和HTML混合的语法,将组件的结构、数据甚至样式都聚合在一起定义组件

```jsx
ReactDOM.render(
  <h1>Hello</h1>,
  document.getElementById('root')
);
```

### 4.2 什么是元素
- JSX其实只是一种语法糖,最终会通过babeljs转译成`createElement`语法
- React元素是构成`React`应用的最小单位
- React元素用来描述你在屏幕上看到的内容
- React元素事实上是普通的JS对象,ReactDOM来确保浏览器中的DOM数据和React元素保持一致。

### 4.3 JSX表达式
- 可以任意地在 JSX 当中使用 JavaScript 表达式，在 JSX 当中的表达式要包含在大括号里

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
let title = 'hello';
let root = document.getElementById('root');
ReactDOM.render(
  <h1>{title}</h1>,
  root
);
```

### 4.4 JSX属性
- 需要注意的是JSX并不是HTML,更像JavaScript。
- 在JSX中属性不能包含关键字，像class需要写成`className`,for需要写成`htmlFor`,并且属性名需要采用驼峰命名法。

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(
  <h1 className="title" style={{ color: 'red' }}>
    Hello
  </h1>,
  document.getElementById('root')
);
```

### 4.5 JSX也是对象
- 可以在if或者for语句中使用JSX
- 将它赋值给变量，当做参数传入，或者作为返回值都是可以的

if中使用
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');
// 打招呼函数
function greeting(name) {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  }
  return <h1>Hello, Stranger。</h1>;
}

const element = greeting('louis');
ReactDOM.render(
  element,
  root
);
```

for中使用
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');
let names = ['张三', '李四', '王五'];
let elements = [];
for (let i = 0; i < names.length; i++) {
  elements.push(<li>{names[i]}</li>);
}
ReactDOM.render(
  <ul>
    {elements}
  </ul>,
  root
);
```

### 4.6 更新元素渲染
- React 元素都是`immutable`不可变的。当元素被创建之后，你是无法改变其内容或属性的。一个元素就好像是动画里的一帧，它代表应用界面在某一时间点的样子.

- 更新界面的唯一办法是创建一个新的元素，然后将它传入`ReactDOM.render()`方法。

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');
function tick() {
  const element = (
    <div>
      {new Date().toLocaleTimeString()}
    </div>
  );
  ReactDOM.render(element, root);
}
setInterval(tick, 1000);
```

### 4.7 React只会更新必要的部分
- React DOM 首先会比较元素内容先后的不同，而在渲染过程中只会更新改变了的部分。
- 即便我们每秒都创建了一个描述整个UI树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容

## 5、手写实现一版 `React.createElement` 和 `ReactDOM.render`
让我们来看下面的代码：
```jsx
import React from "react"
import ReactDOM from "react-dom"

let element = (
  <div className="title" style={{ color: "red" }}>
    <span>hello</span>world
  </div>
)
ReactDOM.render(element, document.getElementById("root"))
```

我们使用jsx语法创建了一个`element`变量, 使用`ReactDOM.render`方法挂载到了页面中。事实上，在React内部是调用了 `React.createElement` 这个方法创建**虚拟DOM**, 

为了证明我们的观点，这里直接调用`React.createElement`方法生成 `element`。请看如下代码：

```jsx
import React from "react"
import ReactDOM from "react-dom"

// let element = (
//   <div className="title" style={{ color: "red" }}>
//     <span>hello</span>world
//   </div>
// )

// 经过babel转义后 上面注释的变成这样
let element = React.createElement("div", {
  className: "title",
  style: {
    color: "red"
  }
},React.createElement("span", null, "hello"), "world");

console.log(JSON.stringify(element,null,2));
ReactDOM.render(element, document.getElementById("root"))
```

上面两种写法是等价的, 并且我们尝试打印一下生成的这个`element`元素。返回的其实是一个对象，这个就是传说中的**虚拟DOM**,

```json
{
  "type": "div",
  "key": null,
  "ref": null,
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": "span",
        "key": null,
        "ref": null,
        "props": {
          "children": "hello"
        },
        "_owner": null,
        "_store": {}
      },
      "world"
    ]
  },
  "_owner": null,
  "_store": {}
}
```

```jsx
<div className="title" style={{ color: "red" }}>
  <span>hello</span>world
</div>
```
对比jsx我们分析下返回的这个数据的结构有哪些特点:
- 无论是`div`标签自身上的属性还是它孩子元素，都是放在`props`这个属性上面存放的。
- hello文本包裹在`span`标签内，world是一个纯文本，都属于孩子元素，所以chidren形式是一个数组，存放所有孩子元素。

至于原生React渲染出来的属性：`key、ref、_owner、_store` 这些属性我们暂时还用不到，所以第一版实现的时候先不予考虑,后续如果有需要我们再加上对这些属性的处理。

注意到上面这些点，我们尝试自己手动实现一版`React.createElement`方法,所能实现的功能要和原生返回的数据结构相仿。

要想让React项目执行，其中会有两个环节
- 编译 把我们自己写的jsx代码通过webpack的babel编译成普通的js代码，这一步是在打包的时候做的。跟浏览器无关。
- 运行 让编译后的js文件在浏览器中执行，这个时候会真正的调用createElement方法，返回react元素或者说虚拟dom。









