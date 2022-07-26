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