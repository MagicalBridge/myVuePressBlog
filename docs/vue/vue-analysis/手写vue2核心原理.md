---
sidebar: auto
---

# 手写Vue核心原理

## 一.使用Rollup搭建开发环境

### 1.什么是Rollup?
Rollup 是一个 JavaScript 模块打包器, 可以将小块代码编译成大块复杂的代码 Rollup 更专注于 `JavaScript` 类库打包 （开发应用时使用Webpack，开发库时使用Rollup）

### 2.环境搭建

安装rollup环境:
```sh
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D
```

`rollup.config.js`文件编写

```js
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 模块化类型
    file: 'dist/umd/vue.js', 
    name: 'Vue', // 打包后的全局变量的名字
    sourcemap: true // 代码调试
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // glob写法
    }),
    process.env.ENV === 'development'? serve({
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

Vue的实现是一个函数声明，为了将各个模块拆分方便, 使用的原型的写法。Vue函数接收一个 options 作为参数，options是一个对象，这个options就是用户传递进来的配置选项，这个配置选项中包含 data el watch computed methods。。。

在使用vue-cli脚手架进行开发的时候，都是单组件文件 每个组件本质上都是Vue实例。

导出vue构造函数

```js
import { initMixin } from './init';

function Vue(options) {
  // options 为用户传入的选项
  this._init(options);
}
initMixin(Vue); // 给原型上新增_init方法

export default Vue;
```

只要加载了index.js, 上面的代码都会依次执行，并且是要首先执行的，那么所有在mixin上挂载的所有原型方法都会预先执行，init方法是在`new Vue`的阶段执行的。

## 添加 initMixin 方法的实现
initMixin相当于一个插件，实现起来就是一个函数。 将构造函数作为参数传递进去，对构造函数进行扩展，这里使用了在构造函数的原型上进行扩展的方式，所有的组件实例均可以共享, 表示在vue的基础上做一次混合操作, 这种设计思想也是非常值得借鉴的。

```js
export function initMixin(Vue) {
  // 扩展原型上的方法
  Vue.prototype._init = function (options) {
    // 原型方法中的this指向new出来的实例, 所有的单文件组件、页面都具有这个方法，
    // 这里将this赋值给vm实例，可以使用里面的所有属性。
    const vm = this
    // 用户传递进来的options属性挂载到vm上面, 这时我们能够操作 vm.$options    
    // 将不同的状态放在不同的对象下面进行维护
    initState(vm)
  }
}
```

上面代码中我们封装了一个函数，函数内部扩展了 `_init`方法，这个方法中执行initState方法。开始实现initState方法。

```js
import { observe } from "./observer/index" // node_resolve_plugin
import { isFunction } from "./utils"

export function initState(vm) {
  // 状态的初始化 先 props methods data computed watch
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  // if(opts.computed){
  //   initComputed();
  // }

  // if(opts.watch){
  //   initWatch();
  // }
}

function initData(vm) {
  let data = vm.$options.data
  // vue2中会将data中的所有数据 进行数据劫持 Object.defineProperty 只能拦截已经存在的属性
  data = isFunction(data) ? data.call(vm) : data
  // 响应式处理
  observe(data)
}
```

上面代码中，函数接收vm作为参数，会根据条件进行分流，因为组件或者页面中会有很多的配置，data、props、computed 不同的数据放在不同的函数中做处理。

上面有一个细节需要注意，我们传递的data数据有可能是函数，也有可能是个对象，所以这里需要先做个判断。

## observe 函数的实现









