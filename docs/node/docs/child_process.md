# Node.js child_process模块解读 

在介绍 child_process 模块之前，先看一个例子。

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
    const sum = longComputation();
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
```
可以试一下使用上面的代码启动`Node.js`服务，然后打开两个浏览器选项卡分别访问`/compute`和`/`，可以发现node服务接收到/compute请求时会进行大量的数值计算，导致无法响应其他的请求`/`。

在java语言中，可以通过多线程的方式来解决上述问题，但是node.js 在执行代码的时候是单线程的，那么nodejs应该如何解决上述问题呢？ 其实nodejs可以创建一个子进程执行密集的cpu计算任务（例如上面例子中的 longComputation）来解决问题，而child_process 模块正是用来创建子进程的。

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


