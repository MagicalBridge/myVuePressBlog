---
sidebar: auto
---

# webpack基础
本质上, webpack是一个用于现代`JavaScript`应用程序的静态模块打包工具，当webpack处理程序的时候，它会在内部构建一个依赖图(dependency graph), 这个依赖图对应映射到项目所需要的每个模块，并生成一个或者多个`bundle`。

## 1.1如何安装
在 npm 项目中执行如下命令，可以安装响应模块。
```bash
npm install  webpack webpack-cli --save-dev
```

## 1.2 入口(entry)
入口起点(entry point)指示，webpack应该使用哪个模块，来作为构建其内部依赖图(dependency graph)的开始，webpack会找出有哪些模块和库是入口起点（直接和间接）依赖的。

默认值是 `./src/index.js`,但是你可以通过在 `webpack configuration`中配置 entry 属性，来指定一个（或者多个）不同的入口起点。

### 1.2.1 src\index.js
我们在`src`目录中创建`index.js`,代码添加代码如下。

```js
let title = require('./title.txt');
document.write(title.default);
```

### 1.2.2 创建 webpack.config.js 文件
要想对webpack做更加详细的订制化配置，我们需要创建一个配置文件。
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
};
```

## 1.3 输出(output)

`output`属性告诉webpack在哪里输出它所创建的`bundle`,以及如何命名这些文件。

主要输出文件的默认值是 `./dist/main.js`,其他生成文件默认放置在 `./dist`文件夹中。

我们继续在 `webpack.config.js` 中添加 `output` 配置。


webpack.config.js
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  // 添加输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
};
```

## 1.4 loader
webpack 只能理解 `JavaScrit` 和 `JSON` 文件

loader 让webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖中

我们继续在 `webpack.config.js` 中添加 `loader` 配置。

webpack.config.js

```js
const path = require('path');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  // 添加loader模块
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

## 1.5 插件(plugin)

`loader`用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
