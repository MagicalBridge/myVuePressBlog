---
sidebar: auto
---

# Koa

## koa框架的特点：

- 1.  中间件设计采用洋葱模型：koa的中间件的执行顺序是从外到内，然后再从内到外。
- 2.  基于Promise来处理异步流程： 通过async/await语法简化了异步流程的控制，提高了代码的可读性和可维护性。 
- 3.  核心比较精简，只提供了基本的HTTP功能，而其他功能如路由、输入验证等则通过中间件来实现。
- 4.  封装了Context上下文对象： 中间件在传递信息方面更为方便。 
- 5.  无内置路由系统： 这点与Express框架不同，Koa没有内置路由系统，开发者可以选择更适合自己项目的路由库，比如 koa-router。 
- 6.  在错误处理方面： Koa强调对错误的友好处理，通过try/catch机制捕获错误，使得错误处理更为直观和集中。 

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
- next：也是一个函数，执行之后会把调用权交给下一个中间件

koa这种中间件的设计，可以将不同的功能，通过中间件进行解耦，代码更加容易扩展和维护。并且我们在项目中处理路由模块时候经常用到的fs path等模块，在ctx上下文中做了统一的封装，非常方便。

ctx.body 赋值的时候，即使多次赋值，也不会报错，而是会等到函数执行完毕之后，再统一修改，底层使用的还是 res.end 这个方法

翻看koa的源码目录文件，我们可以看到四个核心的文件
- application 整个koa的核心代码
- context 主要是对ctx的上下文
- request 是针对req 进行的扩展
- response 针对 res 进行的扩展

最终将request 和 response 放到了 context 上，原生的req和res也会被放在 context 上。


## koa中路由中间件的使用
在 Koa 中，定义路由通常使用第三方路由中间件，因为 Koa 本身并没有内置路由功能。最常用的 Koa 路由中间件之一是 `koa-router`。

首先，你需要安装 `koa-router`：

```bash
npm install koa-router
```

然后，使用它在 Koa 应用中定义路由：

```javascript
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 定义一个简单的GET请求路由
router.get('/', async (ctx) => {
  ctx.body = 'Hello, Koa!';
});

// 定义带参数的路由
router.get('/users/:id', async (ctx) => {
  const userId = ctx.params.id;
  ctx.body = `User ID: ${userId}`;
});

// 定义一个POST请求路由
router.post('/users', async (ctx) => {
  // 处理POST请求，例如从请求体中获取数据
  const postData = ctx.request.body;
  ctx.body = `Received data: ${JSON.stringify(postData)}`;
});

// 将路由中间件挂载到Koa应用
app.use(router.routes());

// 启动服务
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

在上述例子中，`koa-router` 被用来创建一个新的路由对象，然后通过调用不同的 HTTP 方法函数（例如 `get`、`post`）定义不同的路由。路由中可以包含动态参数，例如 `:id`，这些参数可以通过 `ctx.params` 来访问。

这里定义了一个路由 /users/:id，其中 :id 是一个动态参数。当请求匹配到这个路由时，koa-router 会将实际的参数值放入 ctx.params 对象中。在中间件的回调函数中，我们通过 ctx.params.id 访问了这个参数，并在响应中返回了用户ID。

你可以通过访问 http://localhost:3000/users/123 来测试这个路由，其中 123 是用户ID。这个值将被捕获并在响应中显示。

最后，通过调用 `app.use(router.routes())` 将路由中间件挂载到 Koa 应用中，使得定义的路由生效。

## 手写一版koa

### 环境的搭建

为了引用自己写的koa代码，而不是使用 `node_modules`的代码。我们创建一个名叫 koa 的文件夹。里面创建一个lib目录。

```sh
-koa
  -lib
  -package.json
```

将package.json中的main字段，设置成 `lib/application.js`, package.json文件中的 **main** 字段用于指定加载该模块时的入口文件。 

当在Node.js中通过require函数加载一个模块的时候, require会首先查找被加载模块的 package.json 文件, 然后读取main字段指定的入口文件。

比如：

```json
{
  "name": "my-module",
  "version": "1.0.0",
  "main": "./lib/index.js" 
}
```

在这个例子中,当加载 **my-module** 模块时, Node.js会首先加载**my-module/package.json**文件, 然后根据main字段指定的 **./lib/index.js** 文件作为入口。

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

在源码中koa被封装成了一个class，所以我们在外面使用new的方式调用。可以使用use方法调用中间件，还具有listen方法，监听对应的服务端口，并且接收一个回调函数。

### 实现 use 和 listen 两个方法。

在上述代码中，先实现use和listen两个方法的逻辑。

```js
// 内部依赖于原生的http模块进行封装
const http = require("http")

class Application {
  // use方法接收一个函数最为入参
  use(middleware) {
    this.fn = middleware
  }
  // 这里使用箭头函数定义了一个函数
  handleRequest = (req, res) => {
    this.fn(req, res)
  }
  // 使用的时候传入的参数，使用...args进行接收，然后全部传递给原生的listen方法。
  listen(...args) {
    // 执行原生的http方法创建服务，this指向Application这个对象
    const server = http.createServer(this.handleRequest)
    server.listen(...args)
  }
}

module.exports = Application
```

上述代码中，启动服务使用的http就是使用原生的http包实现的。

上文中已经说到的下面的几个文件，我们需要在目录中创建出来。

- context 主要是对ctx的上下文
- request 是针对req 进行的扩展
- response 针对res 进行的扩展

我们在创建服务的时候，可能存在的场景是多次使用`new Koa()` 创建实例，并且，在每一个请求过来的时候，我们希望，每次请求的上下文是独立的，互不干扰的。因此这里使用了 `Object.create("xxx")` 将原本的对象创建出来一个新的实例。这样创建出来的新对象可以访问原来对象的原型方法，但是在新的对象上更改属性，并不会影响原来的对象。

完善部分application代码

```js{3-5,9-13,16-26,33-34}
const http = require("http")

const context = require("./context")
const request = require("./request")
const response = require("./response")

class Application {
  constructor() {
    // 每个应用都扩展了一个全新的 context、request、response 从而实现应用的隔离
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







