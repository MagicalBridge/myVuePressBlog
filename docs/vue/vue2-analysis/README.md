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
import {observe} from './observer/index.js'

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  observe(data);
}
```








