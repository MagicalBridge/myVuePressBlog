---
sidebar: auto
---

# effect的实现原理

## 内部是一个响应式对象
effect方法接收一个函数作为参数，effect中传入的函数首先会被执行一次，当函数中的属性发生变化的时候，函数会被再次执行。

内部封装了一个类，每次都会通过`ReactiveEffect`这个类创建一个`_effect`对象。

```js{17}
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

接下来我们要思考依赖收集的操作，就像我们上面描述的那样，我们希望使用的key能够记住响应式对象的实例。这样当属性变化的时候就重新执行函数，重新渲染视图，这就是依赖收集。

具体的我们可以借助js单线程的特性，在全局设置一个变量，执行run方法时候，在调用用户传入的函数之前，先将响应式对象赋值给变量，在触发get取值操作的时候，就能获取到这个变量。

```js{1,13-19}
export let avtiveEffect = undefined

class ReactiveEffect {
  public active: boolean = true
  public fn
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
    // 取值的时候，要让当前的属性和对应的effect关联起来 这就是依赖收集
    // 当我执行run函数的时候，将当前的这个实例赋值给这个变量, 也就放在了全局上
    try {
      avtiveEffect = this
      this.fn()
    } finally {
      avtiveEffect = undefined
    }
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

因为我们的变量是放在全局上的，当我们函数执行完毕之后，还应该把这个变量清空。因为不在函数内部使用的属性，是不需要进行依赖收集的。


## 如何准确的保证key能够访问到正确的effect

我们看如下代码：

```js
effect(() => { // e1
  state.name //  
  effect(() => { // e2
    state.age
  })
  state.address 
})
```

上面代码中, 我们的effect出现了嵌套使用的场景，这样就会存在一个问题，当我们进入e2函数取age属性完毕之后，这个函数就是执行完毕了，完毕之后，会将avtiveEffect变量置空，但是当我们的访问 address 属性的时候，这个变量就找不到了。

为此，我们需要维护一种关系。在早期的vue3版本中，使用的是栈这种数据结构来维护的关系。就拿上面的例子来说，进入函数之后，name属性依赖于e1, age属性依赖于e2,这个时候将e2入栈，执行完毕之后将e2出栈，这个时候address就能够找到e1了。

在新的版本中，使用的是一个属性标识，简单来说，就是让每个effect记住自己的父亲是谁，当自己运行完毕之后，再把全全局变量赋值回自己的父亲。

```js{7,16,21-22}
// 借助js单线程的特性，先设置一个全局的变量
export let avtiveEffect = undefined

class ReactiveEffect {
  public active: boolean = true
  public fn
  public parent = null
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
    // 取值的时候，要让当前的属性和对应的effect关联起来 这就是依赖收集
    // 执行run函数的时候，将当前的这个实例赋值给这个变量, 也就放在了全局上
    try {
      this.parent = avtiveEffect
      avtiveEffect = this
      this.fn()
    } finally {
      // 因为我们的变量是放在全局上的，当我们函数执行完毕之后，还应该把这个值清空
      avtiveEffect = this.parent
      this.parent = null
    }
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

## 依赖收集实现

```js{2,27-28,40-64}
// 借助js单线程的特性，先设置一个全局的变量
export let activeEffect = undefined

class ReactiveEffect {
  public active: boolean = true
  public fn
  public parent = null
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行这个函数的时候，就会到proxy上去取值，就会触发get方法。
    // 取值的时候，要让当前的属性和对应的effect关联起来 这就是依赖收集
    // 执行run函数的时候，将当前的这个实例赋值给这个变量, 也就放在了全局上
    try {
      this.parent = activeEffect
      activeEffect = this
      this.fn()
    } finally {
      // 因为我们的变量是放在全局上的，当我们函数执行完毕之后，还应该把这个值清空
      activeEffect = this.parent
      this.parent = null
    }
  }
}

// 整体的映射关系，使用 WeakMap存储
const targetMap = new WeakMap()

// 这个函数接收两个参数，第一个参数是具体的对象，第二个参数是 propKey 具体到哪一个key。
// 一个属性可以被被多次引用，因此可以对应多个effect。因为可能存在同名的属性，所以用target
// 作为map的key。
// 它的数据结构课程是这样的 
// { 
//  target: { 
//   name: [effect,effect], 
//   age: [effect,effect] 
//  } 
// }
export function track(target, propKey) {
  // 如果在 effect外部使用某个属性，就不需要收集,这里做个判空处理
  if (activeEffect) {
    // 这里做依赖收集, 首先在weakmap中查找搜索target对象是否存在
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      // 如果不存在，就创建这样一个数据结构
      targetMap.set(target, (depsMap = new Map()))
    }

    // 开始处理key相关
    let deps = depsMap.get(propKey)
    if (!deps) {
      // 这里把deps 设计成一个set，因为在同一个effect中
      // 可能会多次使用同一个属性，无需重复收集
      depsMap.set(propKey, (deps = new Set()))
    }
    // 没有收集这个依赖
    let shouldTrack = !deps.has(activeEffect)
    if (shouldTrack) {
      // 就把 activeEffect 放进去
      deps.add(activeEffect)
    }
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

这个函数接收两个参数，第一个参数是具体的对象，第二个参数是 propKey 具体到哪一个key。一个属性可以被被多次引用，因此可以对应多个effect。因为可能存在同名的属性，所以用target作为map的key。
















