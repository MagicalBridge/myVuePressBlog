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


## 6.1 通用脚手架命令Command类的封装

我们需要在models文件夹下面创建一个 command 文件夹和package平行的，同样的，这个也是一个类，用于封装执行命令。那么我们在init方法中，就调用这个类的实例化，而不是单独的书写逻辑。

我们在初始化的方法中参照lerna实现一个runner方法，这个是一个promsie chain 具体的思想就是将 promise.resolve 保存为一个变量，不断的执行then方法，因为 then 方法返回的还是一个 promise ，所以可以无限的then下去，这样。初始化的检查node版本这种逻辑，就可以下沉到这里去执行。

为了保证程序的适度冗余，我其实并没有直接将core里面的代码删除，而是将校验node的功能也下沉到这个 command 实例化中，并且觉得检查两遍版本号并没有什么不妥。

这里还是需要安装 semver colors 还需要安装我们之前封装的 logs 库。

针对异步的场景操作，所有的错误捕获，都得单独进行。否则是捕获不到的。














