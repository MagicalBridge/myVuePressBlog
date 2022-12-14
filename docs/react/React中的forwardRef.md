---
sidebar: auto
---

# React中的forwardRef

对于ref转发，官网中有这样的描述

>Ref 转发是一项将 ref 自动地通过组件传递到其子组件的技巧。对于大多数应用中的组件来说，这通常不是必需的。但其对某些组件，尤其是可重用的组件库是很有用的。


`React.forwardRef(render)`的返回值是react组件，接收的参数是一个render函数，函数签名为`render(props, ref)`，第二个参数将其接受的 ref 属性转发到render返回的组件中。


这项技术在以下两种场景中特别有用:
- 转发 ref 到组件内部的DOM 节点上
- 在高阶组件中转发ref

## 转发ref到组件内部的DOM节点

比如我们想要将一个组件内部的某个元素暴露出去, 就可以这么做

```jsx
// App.js
import React from 'react';
import Foo from './component/Foo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.input = React.createRef(); // 1
    // ↑5
  }
  
  handleClick = (e) => {
    const input = this.input.current;
      // 6
    console.log(input);
    console.log(input.value);
    input.focus();
  }
  
  render() {
    return (
      <>
        <button onClick={this.handleClick}>click to get value</button>
                  {/*2*/}
        <Foo ref={this.input}/>
      </>
    )
  }
}
```

```jsx
// Foo.jsx
import React from 'react';
			                        // 3
const Foo = React.forwardRef((props, myRef) => {
  return (
    <div>
      <p>....一些其他节点</p>								{/*4*/}
      <input type="text" defaultValue='ref 成功转发到 Foo 组件内部的 input节点上' ref={myRef}/>
      <p>....一些其他节点</p>
      <p>....一些其他节点</p>
    </div>
  );
});

export default Foo;

```

仔细看代码中标记的数字，这是ref转发的流程:

- 1.创建了一个ref
- 2.将其挂载到组件上, 这个组件是通过`React.forwardRef`创建出来的, 注意这里很关键，后面细说
- 3.组件Foo接收到了一个ref，于是将它转发到DOM节点input上
- 4.ref如愿的挂载到内部节点input上
- 5.现在`this.input.current`保存着对节点input的引用
- 6.点击按钮, 现在可以很轻松的获取Foo内部节点的value以及获取其焦点

## 细节补充
之前说过，步骤2很关键，这是因为 ref 的值根据节点的类型而有所不同：
- 当 ref 属性用于 HTML 元素时，接收底层 DOM 元素作为其 current 属性。
- 当 ref 属性用于自定义 class 组件时，ref 接收组件实例作为其 current 属性。
- **不能在函数组件上使用** ref 属性，因为他们没有实例。


第一个很好理解，我们上面的例子已经体现了这一点, ref 最终被挂载到了 input 节点上, input是一个HTML元素，所以current中保留的是DOM元素。