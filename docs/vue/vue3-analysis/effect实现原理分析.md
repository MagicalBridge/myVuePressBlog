---
sidebar: auto
---

# effect的实现原理

## 内部是一个响应式对象

根据使用方法可以看出，effect方法接收一个函数作为参数，effect中传入的函数首先会被执行一次，当函数中的属性发生变化的时候，函数会被再次执行。和react中的useEffect特别类似。

内部封装了一个类，每次都会通过`ReactiveEffect`这个类创建一个`_effect`对象。

这里用到了面向切面编程的技巧，将用户传入的函数执行放入了run方法内，这样，就可以在fn函数执行之前做一些事情。

```js{8-10,17}
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

具体的我们可以借助js单线程的特性，在全局设置一个变量，执行run方法时候，**在调用用户传入的函数之前**，先将响应式对象赋值给变量，在触发get取值操作的时候，就能获取到这个变量。

```js{1,13-19}
export let avtiveEffect = undefined // 全局变量

class ReactiveEffect {
  public active: boolean = true
  public fn
  constructor(fn) {
    this.fn = fn
  }
  run() {
    // 执行fn这个函数的时候，就会到proxy上去取值，就会触发get方法。
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

因为我们的变量是放在全局上的，当我们函数执行完毕之后，还应该把这个变量清空。因为不在函数内部使用的属性，是不需要进行依赖收集的，这里使用到了 try finally 代码块。

语句在 try 和 catch 之后无论有无异常都会执行。所以这里清空是在 finally 中执行的。

```js
try {
  tryCode - 尝试执行代码块
}
catch(err) {
  catchCode - 捕获错误的代码块
}
finally {
  finallyCode - 无论 try / catch 结果如何都会执行的代码块
}
```


## 思考：如何准确的保证key能够访问到正确的effect

我们看如下代码：

```js
effect(() => { // e1
  app.innerHTML = state.name
  effect(() => { // e2
    app.innerHTML = state.age
  })
  app.innerHTML = state.address 
})
```

上面代码中, effect出现了嵌套使用的场景，name属性会记住 e1，age属性会记住e2, 这样就会存在一个问题，当我们进入e2函数取age属性完毕之后，这个函数就是执行完毕了，完毕之后，会将avtiveEffect变量置为undefined，但是当我们的访问 address 属性的时候，就找不到了。

为此，我们需要维护一种关系。在早期的vue3版本中，使用的是栈这种数据结构来维护的关系。就拿上面的例子来说，进入函数之后，name属性依赖于e1, e1入栈，age属性依赖于e2, 这个时候将e2入栈，执行完毕之后将e2出栈，这个时候address就能够找到e1了。

在新的版本中，使用的是一个属性标识，简单来说，就是让每个effect记住自己的父亲是谁，当自己运行完毕之后，再把全局变量赋值回自己的父亲。

来看一下具体的代码实现。

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
      this.parent = undefined
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
[try finnally的用法](https://segmentfault.com/a/1190000015196493)

还拿上面的例子说明，执行外层的effect时，avtiveEffect 是个undefined，this.parent就是undefined, 进入内层的时候e2的 this.parent 属性记录为e1, avtiveEffect此时为e2, 当e2执行完毕之后，avtiveEffect 重置为e1, 最后，当e1也执行完毕之后，avtiveEffect重置为最初的undefined。 

## 依赖收集实现

在具体的使用场景中，一个属性可以对应多个effect，同样的，一个effect可以对应多个属性，如下面的代码所示：

```js
effect(() => { 
  app.innerHTML = state.name + state.address 
})

effect(() => { 
  app.innerHTML = state.name
})
```

外部采用weakMap,内部使用 map effect为了去重使用 set 存储。


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
      this.parent = undefined
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
  // 如果在effect外部使用某个属性，不会走run方法，activeEffect不会被赋值，就不会走依赖收集
  if (activeEffect) {
    // 这里做依赖收集, 首先在weakmap中查找搜索target对象是否存在
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      // 如果不存在，就创建这样一个数据结构 value 还是一个map
      targetMap.set(target, (depsMap = new Map()))
    }

    // 开始处理key相关 name 或者 age
    let deps = depsMap.get(propKey)
    if (!deps) {
      // 这里把deps设计成一个set，因为在同一个effect中
      // 可能会多次使用同一个属性，无需重复收集
      depsMap.set(propKey, (deps = new Set()))
    }
    // 假设 name 对应的set中 没有收集这个effect 才去添加
    let shouldTrack = !deps.has(activeEffect)
    if (shouldTrack) {
      // 就把当前activeEffect放进去
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


## 依赖需要双向记忆

上面的代码中，我们已经实现让属性记住自己的effect，做了这样的映射关系，我们接下来要实现双向记录。

双向记录是非常有必要的，因为当某一个effect不存在或者失效的时候，我们还应该通知收集它的属性把这个effect忘记。

```js{8,63-64}
// 借助js单线程的特性，先设置一个全局的变量
export let activeEffect = undefined

class ReactiveEffect {
  public active: boolean = true
  public fn
  public parent = null
  public deps = [] // 实例上挂载一个deps数组
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
      // 双向记忆deps activeEffect.deps 记录的是当前effect关联属性对应的effect
      activeEffect.deps.push(deps)
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

## 触发更新操作

当数据改变的时候，会触视图的更新逻辑。本质上还是一个发布订阅的模式，先在effect里面订阅一个函数，当属性更新的时候，发布执行。

```js
// ....
export function trigger(target, propKey, value) {
  // 一层一层的查找
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果没有找到，说明没有依赖任何effect
    return
  }
  const effects = depsMap.get(propKey)
  // 获取到对应的set之后，遍历执行里面的run方法
  effects && effects.forEach((effect) => { effect.run() })
}
// ...
```

## cleanup操作。

有如下代码：
```js
const { effect, reactive } = VueReactivity
const state = reactive({ name: 'louis', age: 25, flag: true })

effect(() => { // 副作用函数 (effect执行渲染了页面)
  console.log('render')
  document.body.innerHTML = state.flag ? state.name : state.age
});
setTimeout(() => {
  state.flag = false;
  setTimeout(() => {
    console.log('修改name，原则上不更新')
    state.name = 'zf'
  }, 1000);
}, 1000)
```

上面片段中涉及一个新的场景，我们希望根据 flag 属性的值决定在页面中展示name还是age。当flag属性更新之后，页面重新渲染，但是当name已经不再页面中显示的时候，它的值改变，不应该再重新渲染。这个时候就要用到清理的逻辑。

其实本质的问题出在run方法里面，我们应该每次在执行用户传入的fn之前，先清理上一次的effect。

```js
class ReactiveEffect {
  // ......
  run() {
    try {
      this.parent = activeEffect
      activeEffect = this
      cleanEffect(this) // 先清理
      this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
  // ......
}

// ...
export function cleanEffect(effect) {
  // 每次执行之前将之前存放的set清理掉
  let deps = effect.deps // deps中存放的是所有属性的set
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}

// ...
```

在每次渲染之前，都先清理之前的依赖，但是这会有一个问题，在执行`this.fn()`的时候会进行收集依赖，这样边删除，边收集会造成死循环。
为了解决这个问题，需要在trigger方法中做一些处理，创建一个副本，这样就不会死循环了。


```js
// ....
export function trigger(target, propKey, value) {
  // 一层一层的查找
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果没有找到，说明没有依赖任何effect
    return
  }
  let effects = depsMap.get(propKey)
  
  // 创建一个副本
  if (effects) {
    effects = new Set(effects)
  }
  // 获取到对应的set之后，遍历执行里面的run方法
  effects && effects.forEach((effect) => { effect.run() })
}
// ...
```



## 停止effect

看这样一个使用场景：如果我们手动的停止依赖收集的操作，当我们在更改属性的时候，页面就不应该更新了。这里需要注意，目前的代码中effect函数是直接调用的run方法，源码的设计中，返回的是一个runner。

```js
const { effect, reactive } = VueReactivity
const state = reactive({ name: 'louis', age: 25, flag: true })

const runner = effect(() => {
  document.body.innerHTML = state.flag ? state.name : state.age
});

runner.effect.stop()

setTimeout(() => {
  state.flag = false;
}, 1000)
```

实现stop方法:

```js{23-28}
class ReactiveEffect {
  public active: boolean = true
  public fn
  public parent = null
  public deps = [] // 实例上挂载一个deps数组
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
  stop() {
    if (this.active) {
      this.active = false
      cleanEffect(this)
    }
  }
}
```

同样的，针对返回runner，需要修改effect函数的实现
```js
export function effect(fn) {
  // 将用户传递的函数编程响应式的effect
  const _effect = new ReactiveEffect(fn)
  // 更改runner中的this
  _effect.run()
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect // 暴露effect的实例
  return runner // 用户可以手动调用runner重新执行
}
```

## 批量更新
effect函数接收接收两个参数，一个是fn, 还可以提供一个调度函数，这个调度函数允许用户自定义指定一些操作。

```js
  const { effect, reactive } = VueReactivity;
  // 会对属性进行劫持 proxy， 监听用户的获取操作和设置操作
  const state = reactive({ flag: true, name: 'jw', age: 30, n: { n: 100 } })
  let waiting = false
  const runner = effect(() => { // 副作用函数 (effect执行渲染了页面)
    console.log('runner')
    document.body.innerHTML = state.age;
  }, {
    scheduler() { // 调度函数
      if (!waiting) {
        waiting = true
        Promise.resolve().then(() => {
          runner();
          waiting = false;
        })
      }
    }
  });
  setTimeout(() => {
    state.age++
    state.age++
    state.age++
  }, 1000)
```
scheduler 函数内部模拟了一个微任务，当宏任务执行完成后，开始执行内部的代码。因为是支持用户的自定义操作，trigger对应的内容也应该做相应的修改。


```js
// ....
export function trigger(target, propKey, value) {
  // 一层一层的查找
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果没有找到，说明没有依赖任何effect
    return
  }
  let effects = depsMap.get(propKey)
  
  // 创建一个副本
  if (effects) {
    effects = new Set(effects)
  }
  // 获取到对应的set之后，遍历执行里面的run方法
  effects && effects.forEach((effect) => { 
    if (effect.scheduler) {
      effect.scheduler(); // 可以提供一个调度函数，用户实现自己的逻辑
    } else {
      effect.run() 
    }
  })
}
// ...
```

















