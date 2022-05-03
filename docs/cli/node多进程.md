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




