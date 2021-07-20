# Node.js 中的进程和线程


## 进程
进程 process 是计算机中程序关于数据集合的一次运行环境，进程是线程的容器。

我们启动一个服务、运行一个实例，就是开一个服务进程。

Node.js 里通过 node app.js 开启一个服务进程，多进程就是进程的复制（fork），fork 出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。

- Node.js 开启服务进程例子
```js
const http = require('http');

const server = http.createServer();
server.listen(3000, () => {
  process.title = '测试进程';
  console.log('进程id',process.pid)
})
```

## 线程
**线程是操作系统能够进行运算调度的最小单位**,首先我们要明白，线程是隶属于进程的，被包含于进程之中，**一个线程只能隶属于一个进程，但是一个进程可以拥有多个线程**

### 单线程
**单线程就是一个进程只开一个线程**

JavaScript就是输入单线程，程序顺序执行（这里暂且不提JS异步），可以想象一下队列，前面一个执行完毕之后，后面才能执行。当你在使用单线程语言编码时切勿有过多耗时的同步操作，否则线程会造成阻塞，导致后续响应无法处理。

你如果采用 Javascript 进行编码时候，请尽可能的利用Javascript异步操作的特性。

## 一个经典的计算耗时造成线程阻塞的例子。

```js
const http = require('http');
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) {
    sum += i;
  };
  return sum;
};
const server = http.createServer();
server.on('request', (req, res) => {
  if (req.url === '/compute') {
    console.info('计算开始',new Date());
    const sum = longComputation();
    console.info('计算结束',new Date());
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
// 打印结果
计算开始 2021-07-19T14:35:57.452Z
计算结束 2021-07-19T14:36:12.131Z
```
查看打印结果，当我们调用`127.0.0.1:3000/compute`的时候，如果想要调用其他的路由地址比如`127.0.0.1/`大约需要15秒时间，也可以说一个用户请求完第一个compute接口后需要等待15秒，这对于用户来说是极其不友好的。下文我会通过创建多进程的方式`child_process.fork` 和`cluster`来解决解决这个问题。


在java语言中，可以通过多线程的方式来解决上述问题，但是node.js 在执行代码的时候是单线程的，那么nodejs应该如何解决上述问题呢？ 其实nodejs可以创建一个子进程执行密集的cpu计算任务（例如上面例子中的 longComputation）来解决问题，而child_process 模块正是用来创建子进程的。


### 单线程的一些说明
- Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销。
- 当你在项目中需要大量计算，CPU耗时的操作时候，要注意考虑开启多进程来完成了。
- Node.js 开发过程中，错误会引起整个应用退出，应用的健壮性值得考验，，尤其是错误的异常抛出，以及进程守护是必须要做的。
- 单线程无法利用多核CPU，但是后来Node.js 提供的API以及一些第三方工具相应都得到了解决。

在单核 CPU 系统之上我们采用 单进程 + 单线程 的模式来开发。在多核 CPU 系统之上，可以通过 `child_process.fork` 开启多个进程（Node.js 在 v0.8 版本之后新增了`Cluster`来实现多进程架构） ，即 多进程 + 单线程 模式。注意：开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能。

## Node.js 中的进程

**process模块**

Node.js 中的进程 Process 是一个全局对象，无需 require 直接使用，给我们提供了当前进程中的相关信息。

- process.env: 环境变量，




## 创建子进程的方式

child_process 提供了几种创建子进程的方式
- 异步方式 spawn、exec、execFile、fork
- 同步方式 spawnSync、execSync、execFileSync

首先介绍一下spawn方法

```
child_process.spawn(command[, args][, options])

command： 要执行的指令
args：    传递参数
options： 配置项
```
```js
const { spawn } = require('child_process');
const child = spawn('pwd');
```

pwd 是shell的命令，用于获取当前的目录，上面的代码执行完控制台并没有任何的输出，这是为什么呢？

控制台之所以不能看到输出信息的原因是由于子进程要有自己的`stdio`流(stdin、stdout、stderr),控制台输出是与当前进程的`stdio`绑定的，因此如果希望看到输出信息，可以通过在子进程的stdout与当前进程的stdout之间建立管道实现。

```js{3}
const { spawn } = require('child_process');
const child = spawn('pwd');
child.stdout.pipe(process.stdout); 
```
通过子进程和当前进程建立管道连接，成功在控制台输出当前目录信息。


也可以监听事件的方式（子进程的stdio流都是实现了EventEmitter API的，所以可以添加事件监听）
```js
const { spawn } = require('child_process');
const child = spawn('pwd')
child.stdout.on('data', function(data) {
  console.log(data.toString());
});
```

除了建立管道之外，还可以通过子进程和当前进程共用stdio的方式来实现。

```js {3}
const { spawn } = require('child_process');
const child = spawn('pwd', {
  stdio: 'inherit'
});
```
stdio选项用于配置父进程和子进程之间建立的通道，由于stdio有三个(stdin、stdout、stderr) 因此stdio的三个可能的值其实是数组的一种简写

- pipe 相当于['pipe', 'pipe', 'pipe']（默认值）
- ignore 相当于['ignore', 'ignore', 'ignore']
- inherit 相当于[process.stdin, process.stdout, process.stderr]

由于 inherit 方式使得子进程直接使用父进程的stdio, 因此可以看到输出

ignore用于忽略子进程的输出（将/dev/null指定为子进程的文件描述符了），因此当ignore时child.stdout是null。

spawn默认情况下并不会创建子shell来执行命令，因此下面的代码会报错

```js
const { spawn } = require('child_process');
const child = spawn('ls -l');
child.stdout.pipe(process.stdout);

// 报错
events.js:292
      throw er; // Unhandled 'error' event
      ^

Error: spawn ls -l ENOENT
    at Process.ChildProcess._handle.onexit (internal/child_process.js:267:19)
    at onErrorNT (internal/child_process.js:469:16)
    at processTicksAndRejections (internal/process/task_queues.js:84:21)
Emitted 'error' event on ChildProcess instance at:
    at Process.ChildProcess._handle.onexit (internal/child_process.js:273:12)
    at onErrorNT (internal/child_process.js:469:16)
    at processTicksAndRejections (internal/process/task_queues.js:84:21) {
  errno: 'ENOENT',
  code: 'ENOENT',
  syscall: 'spawn ls -l',
  path: 'ls -l',
  spawnargs: []
}
```
如果需要传递参数的话，应该采用数组的方式传入

```js
const { spawn } = require('child_process');
const child = spawn('ls', ['-l']);
child.stdout.pipe(process.stdout);
```
如果要执行 `ls -l | wc -l`,命令的话可以创建两个spawn命令的方式。

```js
const { spawn } = require('child_process');
const child = spawn('ls', ['-l']);
const child2 = spawn('wc', ['-l']);
child.stdout.pipe(child2.stdin);
child2.stdout.pipe(process.stdout);
```

也可以使用exec
```js
const { exec } = require('child_process');
exec('ls -l', function(err, stdout, stderr) {
  console.log(stdout);
});
```

由于exec会创建子shell，所以可以直接执行shell管道命令。

::: tip
spawn采用流的方式来输出命令的执行结果，而exec也是命令的执行结果缓存起来统一放到回调函数参数的里面，因此exec只适用于命令执行的结果数据笔记小的情况。
:::

其实 spawn 也可以通过配置 `shell option`的方式来创建shell进而支持管道命令，如下所示。

```js
const { spawn, execFile } = require('child_process');
const child = spawn('ls -l', {
  shell: true
});
child.stdout.pipe(process.stdout);
```

通过 shell 选项的配置, spawn 就可以和 exec 一样直接使用 shell 子命令了。

配置项除了 stdio、shell 之外还有cwd、env 等常用的选项

**cwd用于修改命令的执行目录**

```js
const { spawn, execFile, fork } = require('child_process');
const child = spawn('ls -l', {
  shell: true,
  cwd: '/usr'
});
child.stdout.pipe(process.stdout);
```

execFile与exec不同, execFile通常用于执行文件，而并不会创建子shell环境。

fork方法是spawn方法的一个特例，fork用于执行js文件创建Node.js子进程。而且fork方式创建的子进程与父进程之间建立了IPC通信管道，因此子进程和父进程之间可以通过send的方式发送消息。

::: warning
注意：fork方式创建的子进程与父进程是完全独立的，它拥有单独的内存，单独的V8实例，因此并不推荐创建很多的Node.js子进程。
:::

fork方式的父子进程之间的通信参照下面的例子

**parent.js**

```js
const { fork } = require('child_process');

const forked = fork('child.js');

forked.on('message', (msg) => {
  console.log('Message from child', msg);
});

forked.send({ hello: 'world' });
```

**child.js**
```js
process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

let counter = 0;

setInterval(() => {
  process.send({ counter: counter++ });
}, 1000);
```
回到本文初的那个问题，我们就可以将密集计算的逻辑放到单独的js文件中，然后在通过fork的方式来计算，等计算完成时候再通知主进程计算结果，这样就避免主进程繁忙的情况了。

**compute.js**
```js
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1000000000000; i++) {
    sum += i;
  };
  return sum;
};

process.on('message', (msg) => {
  const sum = longComputation();
  process.send(sum);
});
```

index.js

```js
const http = require('http');
const { fork } = require('child_process');

const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const compute = fork('compute.js');
    compute.send('start');
    compute.on('message', sum => {
      res.end(`Sum is ${sum}`);
    });
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
```




