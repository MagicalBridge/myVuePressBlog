---
sidebar: auto
---

# React中的useImperativeHandle
[参考链接](https://juejin.cn/post/7146095092674068487)

## useImperativeHandle初探

React官网的定义

`useImperativeHandle` 可以让你在使用 ref 时自定义暴露给父组件的实例值。

官网的话用大白话解析：`useImperativeHandle`的作用是将子组件的指定元素暴露给父组件使用。也就是父组件可以访问到子组件内部的特定元素。

## 获取元素的几种方式
下面我将逐步介绍获取元素的方式，进而引出今天的主角useImperativeHandle。

### useRef：获取组件内部元素

```jsx
import { useRef } from "react"
export default function() {
  //1.
  const ele = useRef()

  //3.获取元素
  const getElememntP = () => {
    console.log(ele.current)
  }
  return <div >
    <button onClick={ () => getElememntP() }> 获取p元素 </button>
    
    //2.
    <p ref={ref}></p>
  </div>
}
```
点击按钮，我们可以获取到p元素。上面是useRef获取元素的方法，先简单小结下步骤
- 1.引入 useRef 定义变量
- 2.在需要获取的dom元素上使用ref进行变量绑定
- 3.使用`变量.current`获取对应元素


###  forwardRef：父组件获取子组件内部的一个元素

上面的`useRef`在函数组件可以获取自身组件内部的元素，但是如果我们需要在父组件获取或者操作儿子组件的一个元素，此时`forwardRef`就随之出现了。

```jsx
// father.js
import { useRef } from "react"
import Son from "./son"

export default function(){
  
  const eleP = useRef()

  const getElement = () => {
    console.log(eleP.current)
  }
  return (
    <div>
      <button onClick={() => getElement()}> 点击获取子组件的p元素 </button>
      <Son ref={eleP}/>
    </div>
  )
}

// son.js
import {forwardRef} from "react"

export default forwardRef(function(props,ref){
  return <div >
    <p ref={ref}></p>
  </div>
})
```

父元素点击按钮后，可以获取到儿子组件的p元素。

forwardRef在父组件获取儿子组件内部一个元素时，操作如下。
- 父组件按照 useRef 的规则绑定到儿子组件上。
- 儿子组件使用`forwardRef`包裹，并在函数组件传递的参数接收, 第一个参数porps接收父组件传递的数据，第二个ref接收的就是dom引用
- 在需要获取儿子组件的元素上直接绑定ref的值

### useImperativeHandle：父组件可以获取/操作儿子组件多个元素

经过上面层层递进，终于来到我们今天的主角了，它可以在父组件内部直接获取儿子组件任意的dom元素对象。

```jsx
// father.js
import {useRef} from "react"
import Son from "./son"

export default function(){
  const eleP = useRef()

  const getElement = () => {
    console.log(eleP.current.ele1.current)
    console.log(eleP.current.ele2.current)
  }
  return <div>
    <button onClick={()=>getElement()}>点击获取子组件元素</button>
    <Son ref={eleP}/></div>
}

// son.js

import {useRef,forwardRef,useImperativeHandle} from "react"

export default forwardRef(function(props,ref){
  const ele1 = useRef()
  const ele2 = useRef()
  
  useImperativeHandle(ref,() => {
    return { ele1, ele2 }
  },[])

  return <div >
    <h2 ref={ele1}></h2>
    <h3 ref={ele2}></h3>
  </div>
})
```

父组件点击按钮后，可以一次性获取到多个标签元素，通过`useImperativeHandle`函数内部返回的对象可以获取对应的标签。具体使用直接看例子就行，我列举下`useImperativeHandle`的参数要求吧.

```js
useImperativeHandle(ref,()=>{
  return {dom1,dom2}
},[])
```

第一个参数是组件的第二个参数ref第二个参数是一个回调函数，内部返回的对象就是抛给父组件的元素对象 第三个参数是一个依赖数组，类似useEffect的依赖数组，如果依赖数组内部传递的数据发生改变，就会重新触发回调函数。






