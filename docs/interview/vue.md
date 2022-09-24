---
sidebar: auto
---

# Vue

## 谈谈你对MVVM的理解
这种问题其实并不是很好回答的，需要组织语言，不要乱说，说出的东西务必准确，不要有模棱两可的
- 1、MVVM 是一种架构模式，我们比较熟悉的还有服务端常见的MVC这种架构模式。**（首先说出这是中架构模式，点出MVC这种模式，说明对于服务端的内容有了解）**
- 2、这些模式的出现是为了职责划分，设计和代码分层，这种分层的思想是最早借鉴于后端，但是对于前端来说，如果使用MCV会有一个问题，就是把 Controller写的非常重，对于前端来说，就是如何将数据同步到页面上。**(第二点回答出来为什么要这样设计)**
- 3、MVVM 中的M指的是数据 Model 这个Model 可以是从服务端获取的，也是是现代js框架中定义的自身的数据，V 指的是View 就是我们的DOM和页面 VM 指的是ViewModel，是将原本需要手动触发的 Controller 做了抽象和隐藏，不需要用户关心，view变化，自动通过 ViewModel 更新到数据层，数据更新时会通过 ViewModel 更新到视图层。**（这部分说清楚了名词含义，拆开来分析）**
- 4、之所以能这样，是因为ViewModel对属性实现了Observer, 当属性变更时都能触发对应的操作（提一嘴实现原理）ViewModel
- 5、vue 和 react 从本质上说：都是视图层的框架，vue中只是借鉴了ViewModel 这种思想。

## 请说一下Vue2和Vue3响应式数据的理解
- vue2中在初始化阶段，就会对数据进行劫持操作，内部封装了一个 `defineReactive` 方法, 使用 Object.defineProperty 将属性进行劫持，只会劫持已经存在的属性。
- 在处理属性的时候，针对数组和对象做了分流处理，数组则是通过重写数组的方法来实现的。针对能够改变数组的那七个方法进行重写。
- 如果遇到多层对象，通过递归实现响应式观测。对性能有一定的影响
- vue3 采用的是 proxy 代理的方式。

> src/core/observer/index.js:135
```js
export function defineReactive ( // 定义响应式数据
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  // 如果不可以配置直接return
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 对数据进行观测
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () { // 取数据时进行依赖收集
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) { // 让对象本身进行依赖收集
          childOb.dep.depend()  // {a:1}  => {} 外层对象
          // 如果是数组  {arr:[[],[]]} vm.arr取值只会让arr属性和外层数组进行收集  
          if (Array.isArray(value)) {  
            dependArray(value) 
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

## Vue中如何检测数组的变化？
- 数组为了考虑性能的原因没有用defineProperty对数组的每一项进行拦截，而是选择重写数组的7个方法。push shift pop splice unshift sort reverse 方法。
- 数组中如果是对象数据类型也会进行递归劫持，比如：`{arr:[[2],[3]]}` 数组中嵌套数组，在数据劫持的时候会对孩子进行判断，如果是对象，会进行递归依赖收集。
- 数组的索引和长度变化是无法监控到的。

> src/core/observer/index.js:47
> src/core/observer/array.js:11

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted) // 新增的数据需要进行观测
    // notify change
    ob.dep.notify()
    return result
  })
})
```

## Vue中如何进行依赖收集？
- vue在初始化的时候会进行一个挂载操作，在挂载操作的时候，会进行编译的处理，最终生成的是render Function。
- 当视图渲染的时候，会进行取值操作，此时会触发getter操作。在响应式拦击部会给每个属性实例化一个dep。
- 每个属性都拥有自己的dep属性，此时会触发属性依赖收集，也就是执行dep.depend，此时就会收集watcher。
- 当属性变化的时候通知自己对应的watcher去更新。dep会将自己收集的watcher拿出来依次执行。

## 如何理解Vue中模板编译原理？
核心是是将template转换成render函数。
- 1- vue中使用正则，将template编译成ast的语法树-parseHTML
- 2- 对静态语法做静态标记 markup 做静态标记的原因是在做diff算法的时候可以跳过比对。实现的思想就是先默认标记父节点是静态的，然后深度优先遍历所有的子节点，发现孩子中有动态的节点，那再将这个节点设置成非静态的。
- 3- 重新生成代码 codegen 核心就是拼装字符串, 用 with 语法包起来，使用new Function生成一个函数。

```js
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options) // 1.解析ast语法树
  if (options.optimize !== false) {          
    optimize(ast, options)                    // 2.对ast树进行标记,标记静态节点
  }
  const code = generate(ast, options)         // 3.生成代码
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

## Vue生命周期钩子是如何实现的
- vue在初始化的时候会进行一次属性合并mergeHook，本质上就是回调函数，当创建实例的过程中会调用对应的钩子方法。
- 内部会对钩子函数进行处理，将钩子函数维护成数组的形式。

## Vue的生命周期方法有哪些？一般在哪一步发送请求及其原因
- beforeCreate 在实例初始化之后，数据观测 (data observer) 和event/watcher 事件配置之前被调用。
- created 实例已经创建完成之后被调用，在这一步，实例已经完成了以下的配置，数据观测 data observer，属性和方法的运算 watch event事件回调，这里没有$el。


## `Vue.use()`是干什的，原理是什么？

`Vue.use()`是用来使用插件的，它需要在`new Vue({})`启动之前使用。比如我们在项目中配置使用vuex,是在入口文件中实例化vue之前使用`vue.use(vuex)`来调用。

它的源码实现大概是这样的:

```js
export function initUse (Vue) {
  // Vue.use使用插件的
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = []
    if (installedPlugins.indexOf(plugin) > -1) {
      return this // 如果插件安装过了 直接返回
    }

    // additional parameters
    const args = Array.from(arguments).slice(1)
    args.unshift(this) // [Vue,...arguments]
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

从上面的代码中可以看出，它传入的值的类型只能是Function或者Object，然后判断了该插件是不是已经注册过，防止重复注册, 会在调用的install方法的时候，向install方法中注入Vue这个构造函数。这种实现方式可以使插件无需依赖Vue库。直接使用运行环境的即可。


