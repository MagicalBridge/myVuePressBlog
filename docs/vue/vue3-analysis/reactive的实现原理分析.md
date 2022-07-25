---
sidebar: auto
---

# reactive的实现原理分析
[api文档地址](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive)


## 使用场景
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

reactive 只能接收一个对象作为参数，返回一个proxy，并且这种代理是支持嵌套的，多层的对象也可以代理。

这样，reactive方法就可以对传入的对象进行劫持，监听用用户的取值和设置值的操作。

effect函数接收一个函数作为参数，程序运行初始化的时候，会执行一次，当被劫持的对象的属性值改变的时候，会重新执行。页面重新渲染。

## 代码实现

- 1、reactive接收一个对象作为参数
- 2、返回一个proxy对象

```js{10-21}
import { isObject } from "@vue/shared"

export function reactive(target) {
  // 如果传入的值不是对象，直接返回这个值
  if (!isObject(target)) {
    return target
  }

  // 创建proxy代理对象
  const proxy = new Proxy(target, {
    // 拦截对象属性的读取，比如 proxy.foo和proxy['foo']
    get(target, propKey, reactive) {
      console.log("这里可以记录这个属性使用了哪个effect")
      return Reflect.get(target, propKey, reactive)
    },
    // 拦截对象属性的设置 proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    set(target, propKey, value, reactive) {
      console.log("这里可以通知effect重新执行")
      return Reflect.set(target, propKey, value, reactive)
    },
  })
  
  return proxy
}
```

从上面代码中，我们基本上实现了一个基本的代理版本，注意一个细节，就是 Reflect 的使用。

这里可以这样理解：
> Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

- 3、解决缓存的问题
写到这里我们思考一个场景：
```js
const obj = { name: 'louis', age: 25, address: { num: 180 } }
const state1 = reactive(obj)
const state2 = reactive(obj)

console.log(state1 === state2) // false 
```

上面代码中，我们将同一份对象使用 reactive 处理了两次，得到了两个不同的对象，但是因为原对象并没有变化，我们希望有一个缓存，被代理过得对象直接走缓存。

```js{3-4,13-16,32-33}
import { isObject } from "@vue/shared"

// WeakMap的key只能是对象
const reactiveMap = new WeakMap();

export function reactive(target) {
  // 如果传入的值不是对象，直接返回这个值
  if (!isObject(target)) {
    return target
  }

  // 这里从reactiveMap查找缓存列表 存在的话就直接返回，不走重复逻辑
  const existing = reactiveMap.get(target)
  if (existing) {
    return existing
  }

  // 创建proxy代理对象
  const proxy = new Proxy(target, {
    // 拦截对象属性的读取，比如 proxy.foo和proxy['foo']
    get(target, propKey, reactive) {
      console.log("这里可以记录这个属性使用了哪个effect")
      return Reflect.get(target, propKey, reactive)
    },
    // 拦截对象属性的设置 proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    set(target, propKey, value, reactive) {
      console.log("这里可以通知effect重新执行")
      return Reflect.set(target, propKey, value, reactive)
    },
  })

  // key：target对象  value: proxy对象
  reactiveMap.set(target,proxy)

  return proxy
}
```

写到这里，我们的代码依然不是很完善，我们再思考一个场景：


```js
const obj = { name: 'louis', age: 25, address: { num: 180 } }
const state1 = reactive(obj)
const state2 = reactive(state1)

console.log(state1 === state2) // false 
```

我们第一次给reactive传递一个对象obj,返回代理对象 state1，接着我们将 state1 传递给reactive，返回一个state2。

设计的核心思想是，一个对象被代理过了，就不要再被代理一次。

为了解决这个问题，我们可以设置一个代理标识。

```js{6-8,16-20,32-36}
import { isObject } from "@vue/shared"

// WeakMap的key只能是对象
const reactiveMap = new WeakMap()

const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function reactive(target) {
  // 如果传入的值不是对象，直接返回这个值
  if (!isObject(target)) {
    return target
  }

  // 这里是一个小的技巧，对于普通对象来来说, 上面肯定是不包含 __v_isReactive 这个属性的
  // 第一次操作之后返回一个proxy，下次如果把代理对象传递进来之后，只要取属性，就会进入get方法
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 这里从reactiveMap查找缓存列表 存在的话就直接返回，不走重复逻辑
  const existing = reactiveMap.get(target)
  if (existing) {
    return existing
  }

  // 创建proxy代理对象
  const proxy = new Proxy(target, {
    // 拦截对象属性的读取，比如 proxy.foo和proxy['foo']
    get(target, propKey, reactive) {
      // proxy 在取属性的走在这里  target[ReactiveFlags.IS_REACTIVE] 为true 
      // 会直接返回proxy对象，不会再代理一遍。
      if (propKey === ReactiveFlags.IS_REACTIVE) {
        return true
      }
      console.log("这里可以记录这个属性使用了哪个effect")
      return Reflect.get(target, propKey, reactive)
    },
    // 拦截对象属性的设置 proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    set(target, propKey, value, reactive) {
      console.log("这里可以通知effect重新执行")
      return Reflect.set(target, propKey, value, reactive)
    },
  })

  // key：target对象  value: proxy对象
  reactiveMap.set(target, proxy)

  return proxy
}
```

## 依赖收集的实现

当我们执行get函数的时候，会取到每一个属性，我们期望当属性变化的时候，对应的effect函数能够重新执行。这就引出了一个问题，如何能让属性记住自己的effect呢，一个可能的场景是，一个属性可能被多个effect使用。

我们来实现一个函数，解决这个问题。

```js{39-40}
import { isObject } from "@vue/shared"
import { track } from "./effect"

// WeakMap的key只能是对象
const reactiveMap = new WeakMap()

const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function reactive(target) {
  // 如果传入的值不是对象，直接返回这个值
  if (!isObject(target)) {
    return target
  }

  // 这里是一个小的技巧，对于普通对象来来说, 上面肯定是不包含 __v_isReactive 这个属性的
  // 第一次操作之后返回一个proxy，下次如果把代理对象传递进来之后，只要取属性，就会进入get方法
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 这里从reactiveMap查找缓存列表 存在的话就直接返回，不走重复逻辑
  const existing = reactiveMap.get(target)
  if (existing) {
    return existing
  }

  // 创建proxy代理对象
  const proxy = new Proxy(target, {
    // 拦截对象属性的读取，比如 proxy.foo和proxy['foo']
    get(target, propKey, reactive) {
      // proxy 在取属性的走在这里  target[ReactiveFlags.IS_REACTIVE] 为true
      // 会直接返回proxy对象，不会再代理一遍。
      if (propKey === ReactiveFlags.IS_REACTIVE) {
        return true
      }
      // console.log("这里可以记录这个属性使用了哪个effect")
      // 这里做依赖收集函数的调用
      track(target, propKey)
      return Reflect.get(target, propKey, reactive)
    },
    // 拦截对象属性的设置 proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    set(target, propKey, value, reactive) {
      console.log("这里可以通知effect重新执行")
      return Reflect.set(target, propKey, value, reactive)
    },
  })

  // key：target对象  value: proxy对象
  reactiveMap.set(target, proxy)

  return proxy
}
```

[track函数具体实现](./effect实现原理分析.md)