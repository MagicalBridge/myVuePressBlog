---
sidebar: auto
---
# node多进程

## 什么是进程

> 进程process 是计算机中的程序关于某一数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位。

### 进程有两个特点：
- 进程是一个实体，每一个进程都拥有自己的地址空间。
- 进程是一个执行中的程序 存在嵌套关系。

## child_process 用法
- 异步: exec execFile fork spawn 当前主线程中拿不到执行结果
- 同步: execSync execFileSync spawnSync 当前主

一个常见的使用场景；
```js
const cp = require("child_process")

cp.exec("ls -al" ,function(err, stdout, stderr){
  console.log(err)
  console.log(stdout)
  console.log(stderr)
})

cp.execFile("ls", ["-al"] ,function(err, stdout, stderr){
  console.log(err)
  console.log(stdout)
  console.log(stderr)
})
```
可以看出 execFile 是执行文件的，具体来说，和exec有什么区别呢？其实主要的区别在于exec执行的时候支持管道符。但是execFile并不支持。

```js
cp.exec("ls -al | grep node_modules" ,function(err, stdout, stderr){
  console.log(err)
  console.log(stdout)
  console.log(stderr)
})
```

对于spawn来说，适合执行耗时任务，比如 npm install 需要不断的打印日志， exec这个命令 开销结果比较小的任务。

## 5.4 fork的使用：
fork方法类似于require的用法，加载一个指定的文件路径，然后执行。

不太一样的地方是，fork会开启一个子的进程去执行之歌文件。很容易证明这件事情，在执行文件中打印pid，然后在被加载的文件中打印pid。这两个pid是不相同的。

fork方法返回一个child子进程对象，这个对象有一个send方法可以发送信息。这样，在子进程中通过process.on去监听这个事件。

主进程代码：

```js
const child = cp.fork(path.resolve(__dirname, 'child.js'))
child.sned("hello child process!", ()=>{
  child.disconnect() // 断开 如果不断开就是等待状态。
})

console.log("main pid:", process.pid)
```

子进程的代码：

```js
console.log("child process")
console.log("child pid:", process.pid)

process.on('message', (msg)=>{
  console.log(msg)
})
```

需要注意的是，send 方法是个异步的方法。这点非常重要。

如何让子进程给父进程发送消息呢？

```js
// 子进程
process.send("我是子进程")

// 主进程
child.on("message",(msg)=>{ console.log(msg) })
```

## 5.5 几个常用的同步方法：

```js
const ret = child.execSync("ls -al | grep node_modules");
console.log(ret.toString()) // 这样就能打印出来
```



## 6.1 通用脚手架命令Command类的封装

我们需要在models文件夹下面创建一个 command 文件夹和package平行的，同样的，这个也是一个类，用于封装执行命令。那么我们在init方法中，就调用这个类的实例化，而不是单独的书写逻辑。

我们在初始化的方法中参照lerna实现一个runner方法，这个是一个 `promsie chain` 具体的思想就是将 `promise.resolve` 保存为一个变量，不断的执行then方法，因为 then 方法返回的还是一个 promise ，所以可以无限的then下去，这样。初始化的检查node版本这种逻辑，就可以下沉到这里去执行。

为了保证程序的适度冗余，我其实并没有直接将core里面的代码删除，而是将校验node的功能也下沉到这个 command 实例化中，并且觉得检查两遍版本号并没有什么不妥。

这里还是需要安装 semver colors 还需要安装我们之前封装的 logs 库。

针对异步的场景操作，所有的错误捕获，都得单独进行。否则是捕获不到的。

```js
class Command {
  constructor(argv) {
    if (!argv) {
      throw new Error("参数不能为空!")
    }

    if (!Array.isArray(argv)) {
      throw new Error("参数必须为数组！")
    }

    if (argv.length < 1) {
      throw new Error("参数列表不能为空！")
    }

    this._argv = argv
    // 借助promise 直接 new Command 就会执行 下面的逻辑
    this.runner = new Promise((resolve, reject) => {
      // 返回的chain 也是一个promsie
      let chain = Promise.resolve()
      chain = chain.then(() => this.checkNodeVersion())
      chain = chain.then(() => this.initArgs())
      // 下面的方法就是执行用户自己的逻辑了
      chain = chain.then(() => this.init())
      chain = chain.then(() => this.exec())
      // 监听promsie的异常
      chain.catch((err) => {
        log.error(err.message)
      })
    })
  }
  // 。。。。。。
}
```

## 6.4 使用node多进程的spawn执行代码：

```js
if (rootFile) {
  try {
    // const code = "console.log(1)"
    const code = `require('${rootFile}').call(null, ${JSON.stringify(Array.from(currentArgs))})`
    // 使用 spawn 利于node多进程的方式来执行命令 第一个参数-e 是执行代码的意思
    const child = spawn("node", ["-e", code], {
      cwd: process.cwd(),
      stdio: "inherit", // 和父进程做通信
    })

    child.on("error", (e) => {
      log.error(error.message)
      process.exit(1)
    })

    child.on("exit", (e) => {
      log.verbose("命令执行成功" + e)
      process.exit(e)
    })
  } catch (error) {
    log.error(error.message)
  }
} else {
  return null
}
```

上述代码中 使用spawn将代码所要执行的代码变成了一个字符串执行，这种使用方式需要注意。


## 6.5 做好windows系统的兼容处理
因为不同的系统中，终端的命令的执行存在些许差异，这里做下兼容处理：

```js
// 对于windows的兼容处理
function spawn(command, args, options) {
  const win32 = process.platform === "win32";
  const cmd = win32 ? "cmd": command
  const cmdArgs = win32? ['/c'].concat(command,args): args;
  return cp.spawn(cmd, cmdArgs,options || {})
}
```

## 创建项目流程设计和开发
[创建项目流程设计和开发](./创建项目流程设计和开发.md)
















