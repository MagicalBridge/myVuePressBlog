---
sidebar: auto
---

# React中的性能优化

## 1- 使用Fragment
- Fragment 可以让你聚合一个子元素列表,并且不在DOM中增加额外节点
- Fragment 看起来像空的 JSX 标签

### 举例说明

#### 1.1 index.js
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Table from './components/Table';
let data = [
  {id:1,name:'louis',age:10},
  {id:2,name:'carry',age:10}
]
ReactDOM.render(<Table data={data} />, document.getElementById('root'));
```

#### 1.2 Table.js
src\components\Table.js

```js
import React from "react";
class Columns extends React.Component {
  render() {
    let data = this.props.data;  
    //Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>
    return (
        <><td>{data.id}</td><td>{data.name}</td><td>{data.age}</td></>
    )
  }
}
export default class Table extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Age</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.data.map((item, index) => (
             <tr key={index}>
              <Columns data={item} />
             </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}
```

从上面代码中可以看出，Columns 组件中return出来的多个元素，如果没有外层的包裹，就会报错，这个时候就可以使用Fragment。


## 2- 在类组件中使用 PureComponent

当一个组件的props或state变更，React会将最新返回的元素与之前渲染的元素进行对比，以此决定是否有必要更新真实的 DOM，当它们不相同时 React 会更新该 DOM。

如果渲染的组件非常多时可以通过覆盖生命周期方法 shouldComponentUpdate 来进行优化。

shouldComponentUpdate 方法会在重新渲染前被触发。其默认实现是返回 true,如果组件不需要更新，可以在shouldComponentUpdate中返回 false 来跳过整个渲染过程。其包括该组件的 render 调用以及之后的操作。


### 举例说明

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  state = {counter:{number:0}}
  add = () => { 
    let oldState = this.state;
    let amount = parseInt(this.amount.value);
    let newState = {
      ...oldState,counter : amount===0 ? oldState.counter : {number : oldState.counter.number + amount}
    };
    this.setState(newState);
  }
  render(){
    console.log('App render');
    return (
      <div>
        <Counter counter={this.state.counter}/>
        <input ref={inst=>this.amount = inst}/>
        <button onClick={this.add}>+</button>
      </div>
    )
  }
}

class Counter extends React.Component{
  render(){
    console.log('Counter render');
    return (
      <p>{this.props.counter.number}</p>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

Counter 组件在接收的props不变的时候，我们并不希望它触发重新渲染。这个时候就可以使用 PureComponent 进行组件包裹。

```jsx
// ... 
class Counter extends React.PureComponent {
  render(){
    console.log('Counter render');
    return (
      <p>{this.props.counter.number}</p>
    )
  }
}
// ... 
```







