---
sidebar: auto
---

# 手写Vue核心原理

## 一.使用Rollup搭建开发环境

### 1.什么是Rollup?
Rollup 是一个 JavaScript 模块打包器,可以将小块代码编译成大块复杂的代码， `rollup.js`更专注于`JavaScript`类库打包 （开发应用时使用Webpack，开发库时使用Rollup）

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

只要加载了index.js 这个文件下面的函数都会执行，并且是要首先执行的，那么所有在mixin上挂载的所有原型方法都会预先定义执行，init方法是在`new Vue`的时候执行的。

