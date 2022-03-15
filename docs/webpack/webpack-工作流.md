---
sidebar: auto
---

# webpack工作流

## webpack工作流
- 1 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的配置对象
- 2 用上一步得到的参数初始化Compiler对象
- 3 加载所有配置的插件
- 4 执行对象的run方法开始执行编译
- 5 根据配置中的entry找出入口文件
- 6 从入口文件出发，调用所有配置的loader对模块进行编译
- 7 再找出该模块依赖的模块，再递归本步骤，直到所有入口依赖的文件都经过了本步骤的处理。
- 8 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk
- 9 再把每个chunk转换成一个单独的文件加入到输出列表
- 10 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

> 以上过程中，webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用webpack提供的api改变webpack的运行结果。

## 调试webpack

我们新建一个webpack项目, 项目结构目录如下：

```
.
├── debugger.js
├── dist
│   ├── index.html
│   └── main.js
├── package-lock.json
├── package.json
├── src
│   ├── index.html
│   └── index.js
└── webpack.config.js
```

我们在根目录下面创建了一个debugger.js 文件，写入以下代码。

```js
// -- debugger.js
// 核心包
const webpack = require("webpack")
// 配置文件
const webpackOptions = require("./webpack.config")
// 创建编译对象 全局只有一个
const compiler = webpack(webpackOptions)
// 执行run方法
compiler.run((err,stats) => {
  console.log(err);
  console.log(stats.toJson({
    assets: true
  }));
})
```

从上面的代码我们可以看出，webpack 是一个函数，接收一个options 作为参数。我们可以基于此手写一版代码。

```js
const Compiler = require("./Compiler")
// 这是webpack核心代码
function webpack(options) {
  
  // 1 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的配置对象
  let shellConfig = process.argv.slice(2).reduce((shellConfig, item) => {
    let [key, value] = item.split("=")
    shellConfig[key.slice(2)] = value
    return shellConfig
  }, {})

  let finalConfig = { ...options, ...shellConfig }

  // - 2 用上一步得到的参数初始化Compiler对象
  let compiler = new Compiler(finalConfig)
  return compiler
}

module.exports = webpack
```

我们再看下 Compiler 的逻辑。通过上述代码，可以判断出  Compiler 是一个对象。

```js
const { SyncHook } = require("tapable")

class Compiler {
  constructor(options) {
    this.options = options
    this.hooks = {
      run: new SyncHook(), // 开始自动编译 刚刚开始
      emit: new SyncHook(), // 会在将要写入文件的时候触发
      done: new SyncHook(), // 将会在完成编译时候触发，全部完成
    }
  }
  // run 方法接收一个回调函数作为参数
  run(callback) {
    console.log("Compiler开始编译了")
    callback(null, {
      toJson() {
        return {
          files: [], // 产出了哪些文件
          assets: [], // 生成了哪些资源
          chunk: [], // 生成了哪些模块
          moudle: [], // 模块信息
          entries: [], // 入口信息
        }
      },
    })
  }
}

module.exports = Compiler
```

