---
sidebar: auto
---

# Koa

## 使用koa快速搭建一个服务

```js
const Koa = require("koa")

// 使用koa 创建一个应用实例
const app = new Koa()

app.use((ctx) => {
  // 等待这个函数全部执行完毕后才会将body对应的值写出去
  ctx.body = "hello koa"
})

// 监听3000端口，接收一个回调
app.listen(3000, function () {
  console.log(`serve start 3000`)
})
```
上面短短的几行代码已经创建了一个简单的服务, 启动服务后, 浏览器地址栏输入 `localhost:3000` 页面打印 `hello koa`

koa 在源码中是使用类实现的，所以初始化的时候，使用 `new Koa()` 来实例化。

实例上有一个use方法，这就是个中间件，接收一个函数，函数中有两个参数：
- ctx：上下文，每请求一次都会产生一个上下文 
- next：

koa 这种中间件的设计，可以将不同的功能，通过中间件进行解耦，代码更加容易扩展和维护。并且我们在项目中处理路由模块时候经常用到的fs path等模块，在ctx上下文中做了统一的封装，非常方便。

ctx.body 赋值的时候，即使多次赋值，也不会报错，而是会等到函数执行完毕之后，再统一修改，底层使用的还是 res.end 这个方法

翻看koa的源码目录文件，我们可以看到四个核心的文件
- application 整个koa的核心代码
- context 主要是对ctx的上下文
- request 是针对req 进行的扩展
- response 针对 res 进行的扩展

最终将request 和 response 放到了 context 上，原生的req和res也会被放在 context 上。

## 手写一版koa

### 环境的搭建

为了引用自己写的koa代码，而不是使用 `node_modules`的代码。我们创建一个名叫 koa 的文件夹。里面创建一个lib目录。
```
-koa
  -lib
  -package.json
```

其中package.json main字段，设置成 `lib/application.js`

调用服务的代码我们修改成：
```js
// 引用自己书写的koa源码
const Koa = require("./koa/lib/application")

let app = new Koa()

// 先将项目改造成这个样子
app.use((req, res) => {
  res.end("hello koa")
})

app.listen(3000, function () {
  console.log("项目启动了")
})
```

### 实现 use 和 listen 两个方法。

在上述代码中，先实现use和listen两个方法的逻辑。

```js
const http = require("http")

class Application {
  use(middleware) {
    this.fn = middleware
  }
  handleRequest = (req, res) => {
    this.fn(req,res)
  }
  listen(...args) {
    // 执行原生的http方法创建服务
    const server = http.createServer(this.handleRequest)
    server.listen(...args)
  }
}

module.exports = Application
```

上述代码中，启动服务使用的http就是使用原生的http包实现的。


上文中已经说到的下面的几个文件，我们需要在目录中创建出来
- context 主要是对ctx的上下文
- request 是针对req 进行的扩展
- response 针对 res 进行的扩展

我们在创建服务的时候，可能存在的场景是 对多次使用`new Koa()` 创建实例，并且，在每一个请求过来的时候，我们希望，每次请求的上下文是独立的，互补干扰的。因此这里使用了 `Object.create("xxx")` 将原本的对象创建出来一个新的实例。可以访问原来对象的原型方法，但是在新的对象上更改属性，并不会影响原来的。

完善部分application代码
```js{3-5,9-13,16-26,33-34}
const http = require("http")

const context = require("./context")
const request = require("./request")
const response = require("./response")

class Application {
  constructor() {
    // 每个应用都扩展了一个全新的 context、request、response
    // 从而实现应用的隔离
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }

  createContext(req, res) {
    // 每次请求来的时候都应该根据当前应用的上下文创建一个全新的上下文
    let ctx = Object.create(this.context)
    let request = Object.create(this.request)
    let response = Object.create(this.response)
    // 这个是koa中封装的属性
    ctx.request = request
    // 同时原生的req属性也会挂载到 request 上
    ctx.request.req = req
    return ctx
  }

  use(middleware) {
    this.fn = middleware
  }

  handleRequest = (req, res) => {
    const ctx = this.createContext(req, res)
    this.fn(ctx)
  }

  listen(...args) {
    // 执行原生的http方法创建服务
    const server = http.createServer(this.handleRequest)
    server.listen(...args)
  }
}

module.exports = Application
```

完善 request的代码
```js{4-15}
const url = require("url")

const request = {
  // 在 application中的createContext方法中
  // ctx.request.req = req 将原生的req 属性挂载到了request上面
  // 这种写法是属性访问器，访问path的时候其实调用的是原生上的方法
  get path() {
    return url.parse(this.req.url).pathname
  },
  get url() {
    return this.req.url
  },
  get method() {
    return this.req.method
  },
}

module.exports = request
```

我们在真实的使用场景中会使用类似于 ctx.path 这种方式直接取值。其实通过这种方式取值，归根到底还是沿着原型链向上查找。

我们基于此完善 context的代码：
```js{3-7}
const context = {}

function defineGetter(proto, target, key) {
  proto.__defineGetter__(key, function () {
    return this[target][key]
  })
}

defineGetter(context, "request", "url")
defineGetter(context, "request", "path")
defineGetter(context, "request", "method")

module.exports = context
```

上述代码中使用了一个类似于属性访问拦截器的东西，去做属性的代理，其实本质上还是类似于属性访问器。







