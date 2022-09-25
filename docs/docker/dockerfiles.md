---
sidebar: auto
---

# DockerFile 

DockerFile 是用来构建docker镜像的构建文件，是由一些列命令和参数构成的脚本, 必须放在项目的根目录下。

## 构建的三个步骤：
- 编写DockerFile文件
- docker build
- docker run 

## DockerFile 内容基础知识
- 1 每条保留字指令都必须为大写字母且后面要跟随至少一个参数
- 2 指令按照从上到下，顺序执行
- 3 #表示注释
- 4 每条指令都会创建一个新的镜像层，并对镜像进行提交

## Docker 执行DockerFile的大致流程 
- 1 docker 从基础镜像开始运行一个容器
- 2 执行一条指令并对容器做出修改
- 3 执行类似docker commit 的操作提交一个新的镜像层
- 4 docker 再基于刚提交的镜像运行一个新容器
- 5 执行 DockerFile 中的下一条指令直到所有的指令都执行完成

从应用软件的角度看 DockerFile、Docker镜像与docker容器分别代表软件的三个不同阶段
- DockerFile 是软件的原材料
- Docker镜像是软件的交付品
- Docker容器则可以认为是软件的运行态

DockerFile 面向开发，Docker镜像成为交付标准, Docker容器则涉及部署与运维，三者缺一不可。

## 构建镜像的命令

```
docker build -t <name> .  # 最后的这个 `.` 表示的只 Dockerfile 在当前目录下
```

## 具体实例

以 express 启动的服务为例子,创建 server.js文件：
```js
// server.js
'use strict';
var express = require('express');
var PORT = 7300;
var app = express();
app.get('/', function (req, res) { 
  res.send('Hello docker\n');
});
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
```
初始化一个 npm 项目 

```json
{ 
  "name": "dockerTest", 
  "version": "1.0.0",
  "description": "Node.js on Docker", 
  "author": "Docker",
  "main": "server.js",   
  "scripts": { 
    "start": "node server.js"
  },
  "dependencies": { 
    "express": "^4.13.3" 
  }
}
```

在项目目录下新建 `DockerFile` 文件

```
FROM node 
RUN mkdir -p /home/Service # RUN 这个命令执行shell脚本，在home下面创建了一个文件夹
WORKDIR /home/Service  # 指定这个工作的目录
COPY . /home/Service # 拷贝当前目录代码到工作目录
RUN npm install # 安装依赖 可以有多个run
EXPOSE 7300 # 对外暴露的端口是7300
CMD npm start  # 启动服务，只能有一个CMD
## 如果想运行多条指令可以这样：
## CMD git pull && npm install && npm start
```

- FROM: 构建镜像的基础源镜像，node如果不指定版本，就是使用最新的版本
- WORKDIR 用来指定工作目录，即是 CMD 执行所在的目录。
- COPY 命令将宿主机的文件拷贝到镜像中，格式为 `COPY [--chown=<user>:<group>] <源路径>... <目标路径>`，这里将项目目录下的所有文件都拷贝到镜像中的 /home/Service 目录下。如果目标路径不存在，docker 将自动创建。如果有部分的文件不想拷贝怎么办，则新建一个`.dockerignore` 文件，来忽略`node_modules`这种文件。
- RUN 命令用来执行 shell 命令，可以有多个RUN
- EXPOSE 命令用来 声明 运行时容器提供服务端口，但要注意运行时并不会开启这个端口的服务。这个命令主要是帮助使用者理解这个镜像服务的守护端口，以方便配置映射；另外在使用随机端口映射时，会自动随机映射 EXPOSE 的端口
- CMD 是默认的容器主进程的启动命令。

如果启动node服务使用的pm2的话，那在启动之后，为了占据控制台，还应该执行类似于 `npx pm2 log` 这种命令来阻塞命令行。

构建成功的镜像和我们下载的nginx镜像本质上没有区别，我们想要使用我们自己构建的镜像启动一个容器。

```sh
docker run -d  -p 8081:3000 --name myDockerServer editor-server # 创建容器 注意端口的映射

docker ps # 查看启动的容器

# 访问 ip:8081 查看服务
```

