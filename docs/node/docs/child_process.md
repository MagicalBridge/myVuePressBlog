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