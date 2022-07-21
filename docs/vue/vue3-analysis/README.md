---
sidebar: auto
---

# Vue3.0源码结构分析

## Vue2与Vue3的对比
- 对于TypeScript支持不友好（所有属性都放在了this对象上，难以推导组价的数据类型）
- 大量的API挂载在vue对象的原型上，难以实现TreeShaking
- 架构层面对于跨平台dom渲染的开发支持不友好
- CompositionAPI。受ReactHook启发
- 对虚拟DOM进行了重写、对模板的编译进行了优化操作

## monorepo介绍
monorepo 是一种将多个package放在同一个repo中的代码管理模式

新版本的Vue3中使用pnpm来管理项目。

## reactive的实现原理分析

```js
// <script src="../../../node_modules/@vue/reactivity/dist/reactivity.global.js"></script>

const { effect, reactive } = VueReactivity
const state = reactive({ name: 'louis', age: 25, address: { num: 180 } })
console.log(state); //  Proxy {name: 'louis', age: 30, address: {…}}
console.log(state.address); // Proxy {num: 180}

effect(() => {
  app.innerHTML = state.name + '今年' + state.age + "住在幸福小区" + state.address.num + "栋"
})

setTimeout(() => {
  state.age++
}, 1000);
```

通过上述代码可以得知，effect、reactive 是定义在vue响应式模块VueReactivity中的两个方法。

reactive 接收一个对象作为参数，返回一个proxy，并且这种代理是支持嵌套的，多层的对象也可以代理。

这样，reactive方法就可以对传入的对象进行劫持，监听用用户的取值和设置值的操作。

effect函数接收一个函数作为参数，程序运行初始化的时候，会执行一次，当被劫持的对象的属性值改变的时候，会重新执行。页面重新渲染。



