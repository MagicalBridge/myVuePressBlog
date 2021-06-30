---
sidebar: auto
---

# nginx

## 1.nginx使用场景
- 静态资源服务器
- 反向代理服务器
- API接口服务

![nginx使用场景](../../images/nginx/1.jpeg)

## 2.nginx优势
- 高并发高性能
- 可扩展性好
- 高可靠性
- 热部署
- 开源许可证


## 3.环境
为了保证可被外界访问，可以先关闭阿里云的防火墙

### 3.1 关闭防火墙

| 功能      | 命令 |
| ----------- | ----------- |
| 停止防火墙    | systemctl stop firewalld.service   |
| 永久关闭防火墙 | systemctl disable firewalld.service |

### 3.2 安装依赖的模块

```bash
yum  -y install gcc gcc-c++ autoconf pcre pcre-devel make automake openssl openssl-devel
```

| 软件包       |    描述     |
| ----------- | ----------- |
| gcc    | gcc是指整个gcc的这一套工具集合，它分为gcc前端和gcc后端（我个人理解为gcc外壳和gcc引擎），gcc前端对应各种特定语言（如c++/go等）的处理（对c++/go等特定语言进行对应的语法检查, 将c++/go等语言的代码转化为c代码等），gcc后端对应把前端的c代码转为跟你的电脑硬件相关的汇编或机器码|
| gcc-c++ | 而就软件程序包而言，gcc.rpm就是那个gcc后端，而gcc-c++.rpm就是针对c++这个特定语言的gcc前端|
| autoconf | autoconf是一个软件包，以适应多种Unix类系统的shell脚本的工具|
| pcre     | PCRE(Perl Compatible Regular Expressions)是一个Perl库，包括 perl 兼容的正则表达式库|
| vim|  Vim是一个类似于Vi的著名的功能强大、高度可定制的文本编辑器|
|wget | wget 是一个从网络上自动下载文件的自由工具，支持通过 HTTP、HTTPS、FTP 三个最常见的 TCP/IP协议 下载，并可以使用 HTTP 代理|
## 4.nginx的架构

### 4.1 轻量
- 源代码只包含核心模块
- 其他非核心功能都是通过模块实现的，可以自由选择

### 4.2 架构
- nginx 采用的是多进程(单线程)和多路IO复用模型
  
#### 4.2.1 工作流程
- 1、nginx启动后，会有一个`master`进程和多个相互独立的`worker`进程。
- 2、接收来自外界的信号，向各 `worker`进程发送信号，每个进程都有可能来处理这个连接。
- 3、master进程能监控worker进程的运行状态，当worker进程退出后 （异常情况下），会自动启动新的worker进程。

![nginx使用场景](../../images/nginx/02.png)

- worker 进程数，一般会设置成机器的cpu核数，因为更多的worker数，只会导致进程相互竞争cpu，从而带来不必要的上下文切换
- 使用多进程模型，不仅能够提高并发率，而且多个进程之间相互独立，一个worker进程挂了不会影响到其他的worker进程

### 5.nginx的安装

### 5.1 版本的分类
- Mainline version 开发版本
- Stable version 稳定版本
- Legacy versions  历史版本

### 5.2 CentOS下使用 YUM 安装
`vi /etc/yum.repos.d/nginx.repo `

写入下面配置

```
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1
```
执行安装命令

```bash
yum install nginx -y //安装nginx
```
查看安装情况

```bash
nginx -v //查看安装的版本
nginx -V //查看编译时的参数
```






