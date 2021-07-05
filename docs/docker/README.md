---
sidebar: auto
---

# Docker

## 什么是Docker
Docker 是一个开源的应用容器引擎。开发者可以将自己的应用打包在自己的镜像里面，然后迁移到其他平台的 Docker 中。镜像中可以存放你自己自定义的运行环境，文件，代码，设置等等内容，再也不用担心环境造成的运行问题。镜像共享运行机器的系统内核。

同样， Docker 也支持跨平台。你的镜像也可以加载在 Windows 和 Linux，实现快速运行和部署。

## Docker解决了什么问题

一句话，解决了运行环境和配置问题的**软件容器**，方便于持续集成并有助于整体发布推动软件虚拟化技术。

## Docker三要素
- **镜像 (image)**:

Docker镜像就是一个**只读**的模板，镜像可以用来创建docker容器，一个镜像可以创建很多容器。
- **容器（Container）**  
 
Docker利用容器（Container）独立运行的一个或者一组应用，容器是用镜像创建爱你的运行实例。它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证平台的安全。可以把容器看成是一个简单的Linux环境（包括root用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。容器的定义几乎和镜像一模一样，也是一堆层的统一视角，唯一区别在于容器的最上面那一层是可读可写的。

- **仓库**

是集中存放镜像的地方,我们可以把镜像发布到仓储中，需要的时候从仓储中拉取下来就可以了。

## Docker架构
![docker架构](./../images/docker/05.jpg)


## Docker安装 (CentOS7)

在Docker安装之前，我们首先安装`device-mapper-persistent-data` 和 `lvm2` 两个依赖。

`device-mapper-persistent-data` 是 `Lunix`下的一个存储驱动，Linux 上的高级存储技术。

`lvm2` 的作用是创建逻辑磁盘分区，这里我们使用CentOS的Yum包管理工具安装两个依赖。

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2
```
![前置依赖](./../images/docker/01.png)

依赖安装完毕后，我们将阿里云的 Docker 镜像源添加进去。可以加速 Docker 的安装。

```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

最后安装 docker

```shell
yum install docker-ce -y
```

![docker安装完毕](./../images/docker/02.png)

接着执行一下 `docker -v` ，这条命令可以用来查看 Docker 安装的版本信息。当然也可以帮助我们查看 docker 安装状态。如果正常展示版本信息，代表 Docker 已经安装成功。

```shell
docker -v
```
![验证版本](./../images/docker/03.png)

## Docker安装 hello-world镜像

```shell
docker run hello-world
```
![hello-world](./../images/docker/04.png)

从图中展示的信息可以看到，在执行run命令的时候，首先会从本地查找镜像，发现在本地没有找到，就去仓库中寻找，下载之后，基于这个镜像创建一个容器。

## Docker的常用命令

帮助命令
```shell
# 帮助命令
docker --help
```

列出本地主机上的所有镜像
```shell
# 列出本地主机上的所有镜像
docker images
```
