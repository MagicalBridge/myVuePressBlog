---
sidebar: auto
---

# Node基础

## node.js简介
node.js 是⼀个 JS 的服务端运⾏环境，简单的来说，他是在 JS 语⾔规范的基础上，封装了⼀些服务端的运⾏时对象，让我们能够简单实现⾮常多的业务功能。

## node.js 的安装
我们可以使⽤多种⽅式来安装 node.js，node.js 本质上也是⼀种软件，我们可以使⽤直接下载⼆进制安装⽂件安装，通过系统包管理进⾏安装或者通过源码⾃⾏编译均可。

⼀般来讲，对于个⼈开发的电脑，我们推荐直接通过node.js 官⽹的⼆进制安装⽂件来安装。对于打包上线的⼀些 node.js 环境，也可以通过⼆进制编译的形式来安装。

安装成功之后，我们的 node 命令就会⾃动加⼊我们的系统环境变量 path 中，我们就能直接在全局任意位置，使⽤ node 命令访问到我们刚才安装的**node可执⾏命令⾏⼯具**。

## node.js 版本切换
在个⼈电脑上，我们可以安装⼀些⼯具，对 node.js 版本进⾏切换，例如 nvm 和 n。

nvm 的全称就是 node version manager，意思就是能够管理 node 版本的⼀个⼯具，它提供了⼀种直接通过shell 执⾏的⽅式来进⾏安装。简单来说，就是通过将多个 node 版本安装在指定路径，然后通过 nvm 命令切换时，就会切换我们环境变量中 node命令指定的实际执⾏的软件路径。

```bash
curl -o-https://raw.githubusercontent.com/nvmsh/nvm/v0.35.3/install.sh | bash
```
安装成功之后，我们就能在当前的操作系统中使⽤多个node.js 版本。

## node.js 的包管理⼯具 npm
我们对 npm 应该都⽐较熟悉了，它是 node.js 内置的⼀款⼯具，⽬的在于安装和发布符合 node.js 标准的模块，从⽽实现社区共建的⽬的繁荣整个社区。

npx 是 npm@5 之后新增的⼀个命令，它使得我们可以在不安装模块到当前环境的前提下，使⽤⼀些 cli 功能。

```bash
# 此时全局安装了 create-react-app
npm i -g create-react-app
create-react-app some-repo
# 此时⽆论是项⽬中还是全局都没有安装 createreact-app (但实际上是安装了的，但表现确实像没有安装)
npx create-react-app some-repo
```

## node.js 的底层依赖

node.js 的主要依赖⼦模块有以下内容：
- V8 引擎：主要是 JS 语法的解析，有了它才能识别 JS语法
- libuv: c 语⾔实现的⼀个⾼性能异步⾮阻塞 IO 库，⽤来实现 node.js 的事件循环
- http-parser/llhttp: 底层处理 http 请求，处理报⽂，解析请求包等内容
- openssl: 处理加密算法，各种框架运⽤⼴泛
- zlib: 处理压缩等内容

## node.js 常⻅内置模块
node.js 中最主要的内容，就是实现了⼀套 CommonJS的模块化规范，以及内置了⼀些常⻅的模块。

- fs: ⽂件系统，能够读取写⼊当前安装系统环境中硬盘的数据
- path: 路径系统，能够处理路径之间的问题
- crypto: 加密相关模块，能够以标准的加密⽅式对我们的内容进⾏加解密
- dns: 处理 dns 相关内容，例如我们可以设置 dns 服务器等等
- http: 设置⼀个 http 服务器，发送 http 请求，监听响应等等
- readline: 读取 stdin 的⼀⾏内容，可以读取、增加、删除我们命令⾏中的内容
- os: 操作系统层⾯的⼀些 api，例如告诉你当前系统类型及⼀些参数
- vm: ⼀个专⻔处理沙箱的虚拟机模块，底层主要来调⽤ v8 相关 api 进⾏代码解析

## 模块化规范
[模块化规范](../module/README.md)

<!-- ## 文章列表 -->
<!-- [child_process模块](../docs/child_process.md) -->

## 模板引擎的实现原理
[模板引擎实现原理](../docs/模板引擎.md)

## node中的发布订阅
[node中的发布订阅](../docs/node中的发布订阅.md)