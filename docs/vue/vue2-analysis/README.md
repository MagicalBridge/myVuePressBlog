---
sidebar: auto
---

# Vue2 源码解析

## 一.使用Rollup搭建开发环境

### 1.什么是Rollup?
`Rollup`是一个 JavaScript 模块打包器,可以将小块代码编译成大块复杂的代码， rollup.js更专注于Javascript类库打包 （开发应用时使用Webpack，开发库时使用Rollup）

### 2.环境搭建
安装rollup环境

```bash
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D
```

我们介绍下上面安装的这些包的作用：
这个命令安装了一系列用于 JavaScript 项目开发的 npm 包。让我为你解释每个包的作用：

1. **@babel/preset-env**: `@babel/preset-env` 是 Babel 的一个预设，它根据目标环境自动确定需要转换的语法和功能，从而使开发者不必手动配置每个转换。
2. **@babel/core**: Babel 的核心模块，负责实际的代码转换工作。它与各种插件一起工作，其中包括预设（preset）。
3. **rollup**: Rollup 是一个 JavaScript 模块打包器，用于将多个模块整合成一个或多个输出文件。它通常用于构建库或框架。
4. **rollup-plugin-babel**: Rollup 插件，用于在 Rollup 构建过程中集成 Babel，以便在打包时对代码进行转换。
5. **rollup-plugin-serve**: Rollup 插件，用于在开发过程中提供一个本地服务器。这对于在开发过程中实时查看项目变化非常有用。
6. **cross-env**: 一个用于设置跨平台环境变量的工具。它允许你在不同操作系统上使用相同的方式设置环境变量，这在脚本和命令中非常有用。


`rollup.config.js` 文件编写

```js
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 入口文件
  output: {
    format: 'umd', // 模块化类型
    file: 'dist/umd/vue.js', 
    name: 'Vue', // 打包后的全局变量的名字
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development'?
      serve({
        open: true,
        openPage: '/public/index.html',
        port: 3000,
        contentBase: ''
      }) : null
  ]
}
```
配置.babelrc文件

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```
执行脚本配置

```json
"scripts": {
  "build:dev": "rollup -c",
  "serve": "cross-env ENV=development rollup -c -w"
}
```

## 二.Vue响应式原理

vue2的入口文件是一个构造函数，之所以这样设计，原因是为了解耦，将很多功能，通过原型链的形式拆分到了不同的文件中，在具体使用的时候，我们采用的是`new Vue({})`这种形式。

导出 `Vue` 的构造函数

```js
import { initMixin } from './init';

// 这是 Vue 构造函数的定义。当你创建一个新的 Vue 实例时，你需要通过 new Vue(options) 的方式来调用它
function Vue(options) {
  this._init(options);
}

// 这个函数的作用是在 Vue 的原型上添加一个名为 _init 的方法，用于执行 Vue 实例的初始化过程
initMixin(Vue); // 给原型上新增_init方法

export default Vue;
```

上面这段代码是一个非常简化的 Vue.js 的核心部分，它展示了 Vue 对象的基本结构和初始化过程。

1. `import { initMixin } from './init';`: 这行代码从相对路径 `./init` 导入了一个名为 `initMixin` 的函数。这样的导入语句用于从其他文件中引入一些功能性的代码。

2. `function Vue(options) { this._init(options); }`: 这是 Vue 构造函数的定义。当你创建一个新的 Vue 实例时，你需要通过 `new Vue(options)` 的方式来调用它。构造函数接受一个 `options` 对象作为参数，这个对象包含了 Vue 实例的配置信息。

3. `initMixin(Vue);`: 这一行调用了之前导入的 `initMixin` 函数，并将 `Vue` 构造函数作为参数传递给它。这个函数的作用是在 `Vue` 的原型上添加一个名为 `_init` 的方法，用于执行 Vue 实例的初始化过程。

4. `export default Vue;`: 这行代码将 Vue 构造函数作为默认导出，使得其他文件可以通过 `import Vue from 'vue'` 的方式引入它。

打开 `./init` 文件，会找到 `initMixin` 函数的定义，它会包含一些 Vue 实例初始化的逻辑。这种拆分代码的方式有助于保持代码的组织结构清晰，并将不同功能划分到不同的文件中。

init方法中初始化vue状态

```js
import {initState} from './state';

export function initMixin(Vue){
  Vue.prototype._init = function (options) {
    // 创建一个指向当前 Vue 实例的引用，通常在 Vue 实例内部的函数中，this 指向当前实例。
    const vm  = this;
    // 将传递给 _init 方法的配置对象存储在实例的 $options 属性中，以便后续使用。
    vm.$options = options
    // 调用之前导入的 initState 函数，传递当前 Vue 实例作为参数。
    initState(vm)
  }
}
```
从上面代码我们可以看到，initMixin 这是一个导出的函数，接受 Vue 构造函数作为参数。这个函数用于给 Vue 的原型上添加 _init 方法，该方法负责执行 Vue 实例的初始化。

`Vue.prototype._init = function (options) {...}`: 这一行代码将一个名为 _init 的方法添加到 Vue 的原型上。这个方法接受一个 options 对象，该对象是创建 Vue 实例时传递的配置。

我们再来看看  initState 这个方法的实现：

```js
export function initState(vm){
  const opts = vm.$options;
  if(opts.props){
    initProps(vm);
  }
  if(opts.methods){
    initMethod(vm);
  }
  if(opts.data){
    // 初始化data
    initData(vm);
  }
  if(opts.computed){
    initComputed(vm);
  }
  if(opts.watch){
    initWatch(vm);
  }
}
function initProps(){}
function initMethod(){}
function initData(){}
function initComputed(){}
function initWatch(){}
```

从上面代码我们可以看出，在函数内部拿到options之后，根据不同的属性进行初始化操作。

data，使我们平时用到的最多的属性，我们会再上面挂载一些数据，这些数据都是响应式的，有时候会用这些数据和模板进行交互，有些时候会用数据和逻辑进行交互。

### 1.初始化数据

```js
// 将响应式的模块单独抽离出来
import { observe } from './observer/index.js'

function initData(vm) {
  let data = vm.$options.data;
  // 这个data可以写成一个对象，也可以写成一个函数，这个时候需要进行兼容处理
  // 如果是函数的话，我就取它的返回值，如果是对象的话，就直接使用对象
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  // vue2中会将data中的所有数据进行数据劫持
  observe(data);
}
```

### 2.递归属性劫持

```js
class Observer { 
  constructor(value){
    this.walk(value);
  }
  walk(data){ // 让对象上的所有属性依次进行观测
    // 使用Object.keys 这个方法不会取到原型链上的属性
    let keys = Object.keys(data);
    for(let i = 0; i < keys.length; i++){
      let key = keys[i];
      let value = data[key];
      // 三个参数 原始对象 当前key 当前value
      defineReactive(data, key, value);
    }
  }
}

function defineReactive(data, key, value){
  // 在真实的应用场景中，value 可能是个嵌套的对象
  // 这个时候，我们就需要进行递归的劫持
  observe(value);
  
  Object.defineProperty(data,key,{
    get(){
      return value
    },
    set(newValue){
      if (newValue == value) return;
      // vm._data.a = {b:1} 对于这种用户直接设置值的场景
      // 我们也需要进行响应式处理。
      observe(newValue);
      value = newValue
    }
  })
}

export function observe(data) {
  // vue2 中规定，最外层必须是一个对象，这里进行了判空的处理
  // 只有data是对象的场景才进行响应式的观测
  if(typeof data === 'object' && data !== null){
    return;
  }
  // 这里的返回值比较有讲究，将响应式的逻辑抽象为了一个单独的类
  // 最终返回的是类的实例。这里使用类的原因是，它的逻辑比较耦合
  // 类有类型，对象没有类型
  return new Observer(data);
}
``` 

上面代码中：
- `Observer` 类接受一个 value 参数，通常是一个对象。
- `walk` 方法用于遍历对象的所有属性，并对每个属性调用 `defineReactive` 函数进行观测
- `defineReactive` 函数用于定义对象的属性，使其具有 getter 和 setter
- 在 `get` 方法中，返回属性的值
- 在 `set` 方法中，当属性值发生变化的时候，触发setter，并在这里进行一些处理。这里会递归调用 observe 确保这个新的值也会被观测。

### 3.数组方法的劫持
在vue2中，在对数组的处理中，没有响应式的监听数组中的每一项，而是采用了一种讨巧的方式。重写数组的方法。

对于数组中的一些变异方法：push shift pop unshift reverse sort splice 可能会更改原数组的方法

```js
import {arrayMethods} from './array';
class Observer { 
  constructor(value){
    if(Array.isArray(value)){
      // 重写数组原型方法
      value.__proto__ = arrayMethods; 
      // 对于 data: { arr: [{anme:'text'},{name:'value'}] } 当我们做这样的更改
      // vm.arr[0].name = 'louis' 这种场景下 每一项都是一个数组，我们是需要监控数组的每一项
      this.observeArray(value);
    }else{
      this.walk(value);
    }
  }

  observeArray(value){
    for(let i = 0 ; i < value.length; i++){
      // 循环遍历数组的每一项 进行监控
      observe(value[i]);
    }
  }
}
```

上面代码中，对于data是数组的形式做了逻辑分流处理，虽然数组没有监控索引的变化，但是索引对应的内容是对象类型，需要被监控。
我们来看看具体是怎么实现的。

```js
let oldArrayProtoMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
];

methods.forEach(method => {
  // 用户调用以上7个方法会用自己重写的，否则用原来的数组
  arrayMethods[method] = function (...args) {
    const result = oldArrayProtoMethods[method].call(this, ...args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // 刨除前两个，最后一个才是新增的
        inserted = args.slice(2)
      default:
        break;
    }
    if (inserted) ob.observeArray(inserted); // 对新增的每一项进行观测
    return result
  }
})
```
添加__ob__属性，

```js
class Observer { 
  constructor(value){
    Object.defineProperty(value,'__ob__',{
      enumerable:false,
      configurable:false,
      value:this
    });
    // ...
  }
 }
```
> 给所有响应式数据增加标识，并且可以在响应式上获取Observer实例上的方法


## 三.模板编译
上面的操作中，做的都是数据劫持的相关操作，在数据变化的时候可以监听到，下面我们需要处理数据的挂载操作。就是将我们写的data中的数据，渲染到模板上面。
在实际的渲染中，我们需要将模板转换为渲染函数，函数的效率肯定是非常高的，这样在渲染函数中可以进行dom-diff操作。

```js
Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = options;
  // 初始化状态
  initState(vm);
  // 页面挂载
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}
Vue.prototype.$mount = function (el) {
  const vm = this;
  const options = vm.$options;
  el = document.querySelector(el);

  // 如果没有render方法
  if (!options.render) {
    let template = options.template;
    // 如果没有模板但是有el
    if (!template && el) {
      template = el.outerHTML;
    }
    const render= compileToFunctions(template);
    // 将render函数挂载到options上。
    options.render = render;
  }
}
```

