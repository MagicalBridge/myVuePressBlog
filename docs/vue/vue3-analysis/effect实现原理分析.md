---
sidebar: auto
---

# effect的实现原理

effect方法接收一个函数作为参数，effect中传入的函数首先会被执行一次，当函数中的属性发生变化的时候，函数会被再次执行。

内部封装了一个类，每次都会通过ReactiveEffect这个类创建一个_effect对象。

```js
// 我们不使用vue原生提供的，自己实现一个
class ReactiveEffect {
  // 这里有一个标识，用来告知是否响应式，默认都是true
  public active: boolean = true
  public fn
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
    this.fn()
  }
}

export function effect(fn) {
  // 这个方法的作用是将用户传递进来的函数，变成一个响应式的effect
  // 这个属性就会记住effect 当属性发生变化的时候，重新执行函数。
  const _effect = new ReactiveEffect(fn)

  // 初始化的时候这个函数会先执行一次
  _effect.run()
}
```
