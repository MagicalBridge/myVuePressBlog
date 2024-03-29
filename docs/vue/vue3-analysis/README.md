---
sidebar: auto
---

# Vue3.0源码结构分析

## Vue的设计思想
- vue3更加注重**模块拆分**，这个特点在vue2中是不具备的，在vue2版本中，如果我们想要使用响应式的部分，需要引入完整的vue.js, vue3中的模块之间的耦合度低，模块可以单独使用。
- vue2中很多方法挂载到了实例中导致没有使用也会被打包（还有很多组件也是一样）。vue3中通过构建工具Tree-shaking机制实现按需引入，减少用户打包后体积。
- vue3允许自定义渲染器，扩展能力强。不会发生以前的事情，改写Vue源码改造渲染方式. 扩展更方便.

## 区分编译时和运行时
- vue3中的虚拟dom，调用渲染方法可以将虚拟dom渲染成真实dom, 虚拟dom手写起来比较麻烦：运行时
- 平时开发时候，我们写的是模板，在编译构建的时候会将模板编译成虚拟dom，不需要在运行时进行编译。

## monorepo介绍
Monorepo 是管理项目代码的一个方式，指在一个项目仓库(repo)中管理多个模块/包(package)。 Vue3源码采用 monorepo 方式进行管理，将模块拆分到package目录中。

- 一个仓库可维护多个模块，不用到处找仓库
- 方便版本管理和依赖管理，模块之间的引用，调用都非常方便

## 包管理工具
Vue3中使用pnpm workspace来实现monorepo (pnpm是快速、节省磁盘空间的包管理器。主要采用符号链接的方式管理模块)

## 全局安装pnpm

```bash
npm install pnpm -g # 全局安装pnpm
```

创建工作区

```bash
pnpm init -y # 初始化配置文件
```

## 创建.npmrc文件并做配置
```
shamefully-hoist = true
```
默认情况下，pnpm并不会把安装的依赖拍平，配置了上面属性之后，会按照npm那种代码组织方式，将安装的依赖拍平。

## 配置workspace
新建 `pnpm-workspace.yaml` 文件,并配置规则。

```yml
packages:
  - 'packages/*'
```

>将packages下所有的目录都作为包进行管理。这样我们的Monorepo就搭建好了。确实比 lerna + yarn workspace 更快捷

## 环境搭建
开发环境，只需要安装 esbuild、typescript、minimist 就可以了

## 初始化TS
```
pnpm tsc --init
```

配置ts的解析规则
```json
{
  "compilerOptions": {
    "outDir": "dist", // 输出的目录
    "sourceMap": true, // 采用sourcemap
    "target": "es2016", // 目标语法
    "module": "esnext", // 模块格式
    "moduleResolution": "node", // 模块解析方式
    "strict": false, // 严格模式
    "resolveJsonModule": true, // 解析json模块
    "esModuleInterop": true, // 允许通过es6语法引入commonjs模块
    "jsx": "preserve", // jsx 不转义
    "lib": [
      "esnext",
      "dom"
    ], // 支持的类库 esnext及dom
    "baseUrl": ".",
    "paths": {
      "@vue/*": [
        "packages/*/src"
      ]
    }
  }
}
```

## 创建模块
>我们现在packages目录下新建两个package，用于手写响应式原理做准备
- reactivity 响应式模块
- shared 共享模块

所有包的入口均为 `src/index.ts` 这样可以实现统一打包。

每个包下面创建单独的 `package.json` 文件

- reactivity/package.json
```json
{
  "name": "@vue/reactivity",
  "version": "1.0.0",
  "main": "index.js",
  "module":"dist/reactivity.esm-bundler.js",
  "unpkg": "dist/reactivity.global.js",
  "buildOptions": {
    "name": "VueReactivity",
    "formats": [
      "esm-bundler",
      "cjs",
      "global"
    ]
  }
}
```
- shared/package.json
```json
{
  "name": "@vue/shared",
  "version": "1.0.0",
  "main": "index.js",
  "module": "dist/shared.esm-bundler.js",
  "buildOptions": {
    "formats": [
      "esm-bundler",
      "cjs"
    ]
  }
}
```
> formats为自定义的打包格式，有esm-bundler在构建工具中使用的格式、esm-browser在浏览器中使用的格式、cjs在node中使用的格式、global立即执行函数的格式

## 开发环境esbuild打包
创建开发时执行脚本， 参数为要打包的模块

### 解析用户参数

```json
"scripts": {
  "dev": "node scripts/dev.js reactivity -f global"
}
```

scripts/dev.js 

```js
const { build } = require("esbuild")
const { resolve } = require("path")
const args = require("minimist")(process.argv.slice(2))

const target = args._[0] || "reactivity"
const format = args.f || "global"

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm"

// 输出的文件
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 入口
  outfile, // 出口
  bundle: true, // 是不是将文件打包在一起，包含第三方的模块
  sourcemap: true, // 是否生成sourcemap文件
  format: outputFormat, // 输出的文件格式
  globalName: pkg.buildOptions?.name, // iife 场景下 挂载的全局变量名称
  platform: format === "cjs" ? "node" : "browser",
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`rebuilt~~~~`)
    },
  },
}).then(() => {
  console.log("watching~~~")
})
```


[reactive的实现原理分析](./reactive的实现原理分析.md)

[effect实现原理分析](./effect实现原理分析.md) 






