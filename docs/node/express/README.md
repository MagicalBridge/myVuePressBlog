---
sidebar: auto
---

# Express

## express的基本使用

```js
const express = require("express")

const app = express()

app.get("/",function(req,res)  {
  res.end("home")
})

app.get("/login",function(req,res)  {
  res.end("login")
})

// 匹配所有，上面的路由都匹配不到，就会走到这里
// app.all("*",function(req,res)  {
//   res.end("404")
// })

app.listen(3000)
```
express 内部采用了回调的形式实现，内置了中间件、路由系统、模板引擎、静态服务。

上述代码中，使用express启动了一个服务，从使用的方式来看，express是一个函数，app是这个函数返回的对象，express内置了路由系统，get方法接收两个参数，一个是路径path，一个是回调函数，回调函数中接收两个参数。req, res。里面还有一个listen方法，监听的端口号，同样的也可以接收一个回调函数，在监听服务启动成功时执行。

## express的基本实现

### 第一个版本
express的源码目录相对来说比较简单,它的package.json文件中没有标明入口文件，这样会查找当前目录下的index.js。

```js
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

module.exports = require('./lib/express');
```
index.js中就做了一件事情，导出了lib模块下的`express.js`文件。内部导出了一个函数`createApplication`

```js
const http = require("http")
const url = require("url")
// 声明一个stack用于存放路由信息
let routes = [
  {
    // 默认规则
    path: "*",
    method: "all",
    handler(req, res) {
      res.end(`cannot  found ${req.method}  ${req.url}`)
    },
  },
]
function createApplication() {
  return {
    // 每次执行get方法的时候，会向栈中新注册一个路由
    get(path, handler) {
      routes.push({
        path,
        method: "get",
        handler,
      })
    },
    // 执行listen方法的时候
    listen(...args) {
      console.log("args",args) // [ 3000, [Function (anonymous)] ]
      // 使用原生的http模块启动一个服务
      const server = http.createServer((req, res) => {
        // 解析请求的路径
        let { pathname } = url.parse(req.url)
        // 拿到请求的方法
        let requestMethod = req.method.toLocaleLowerCase()
        // 从第一项开始匹配
        for (let i = 1; i < routes.length; i++) {
          // 将每一项对应的元素解构出来
          let { path, method, handler } = routes[i]
          // 路由的匹配需要注意一点，路径和方法全部匹配到才算匹配到
          if (path === pathname && requestMethod === method) {
            // 匹配到了就执行回调
            return handler(req, res)
          }
        }
        // 都匹配不到走第一个
        routes[0].handler(req, res)
      })

      server.listen(...args)
    },
  }
}
module.exports = createApplication
```

### 第二个版本

上述代码中，我们把创建服务的逻辑，路由匹配的逻辑，全部都放在一个文件总实现，这样显然不够优雅，我们想到将服务的创建和路由的匹配进行封装。各司其职。为此我们创建一个application.js来封装应用创建的逻辑。新建一个router文件夹，用于处理路由的逻辑。

```js
// application.js
const http = require("http")
const Router = require("./router")

function Application() {
  this._router = new Router()
}
// 将原本的get方法放在原型上面实现
Application.prototype.get = function (path, handler) {
  // 内部调用router的get方法，处理get请求的路由处理，后续还有post等方法。
  this._router.get(path, handler)
}

// 将原本的listen方法放在原型上实现
Application.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    // 所有的路径都没有匹配到的时候，就执行这个方法
    function done() {
      res.end(`cannot ${req.method} ${req.url}`)
    }
    // 调用router中封装的handle方法，处理请求响应
    this._router.handle(req, res,done)
  })
  server.listen(...args)
}

module.exports = Application
```

我们来看看router的内部实现: 

```js
const url = require("url")

function Router() {
  this.stack = []
}
/**
 * 这个方法提供出来的主要能力是操作自己的栈
 */
Router.prototype.get = function (path, handler) {
  this.stack.push({
    path,
    handler,
    method: "get",
  })
}

Router.prototype.handle = function (req, res, done) {
  let { pathname } = url.parse(req.url)
  let requestMethod = req.method.toLocaleLowerCase()
  // 从第一项开始匹配
  for (let i = 0; i < this.stack.length; i++) {
    // 将每一项对应的元素解构出来
    let { path, method, handler } = this.stack[i]
    // 路由的匹配需要注意一点，路径和方法全部匹配到才算匹配到
    if (path === pathname && requestMethod === method) {
      return handler(req, res)
    }
  }
  // 如果路由系统处理不了，就交给应用系统来处理
  done()
}

module.exports = Router
```

从上面的代码中可以看到，router的实现也是基于原型的，这里实现了get和handle两个方法，分别处理路由匹配和路径的处理。如果路由系统处理不了，就交给应用系统来处理。

## express的结构化拆分






