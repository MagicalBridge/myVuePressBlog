---
sidebar: auto
---

# webpack-HMR

## 什么是HMR
Hot Module Replacement 是指当我们对代码修改并保存后，webpack将会对代码进行重新打包，并将新的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，以实现在不刷新浏览器的前提下更新页面

## 如何使用
需要安装 webpack webpack-cli webpack-dev-server html-webpack-plugin 

配置`webpack.config.js`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin")
const path = require("path")

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 8090,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new HotModuleReplacementPlugin()
  ],
}
```

public\index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HMR</title>
</head>

<body>
  <input />
  <div id="root"></div>
</body>

</html>
```

src\index.js
```js
const render = () => {
  const title = require("./title.js")
  document.getElementById("root").innerText = title
}

render()

if (module.hot) {
  module.hot.accept(["./title.js"], render)
}
```

src\title.js

```js
module.exports = "title";
```

package.json
```json
"scripts": {
  "build": "webpack",
  "dev": "webpack serve"
}
```
上述文件配置好了之后，执行npm run  dev启动webpack的开发环境，在浏览器输入localhost:8090, 页面中显示title。修改title文字内容，页面重新加载内容，但是没有刷新。这就是热重载。



