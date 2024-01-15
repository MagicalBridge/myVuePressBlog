---
sidebar: auto
---

# Mongodb

## 什么是MongoDB ?

MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

![数据图示](../../images/database/mongodb/01.png)

## 一些基本概念
- **数据库** MongoDB的单个实例可以容纳多个独立的数据库，比如一个学生管理系统就可以对应一个数据库实例
- **集合** 数据库是由集合组成的,一个集合用来表示一个实体, 如学生集合
- **文档** 集合是由文档组成的，一个文档表示一条记录, 比如一位同学张三就是一个文档

![和mysql关系](../../images/database/mongodb/02.jpeg)

## macos 本机安装

### 下载安装包

```sh
# 进入 /usr/local 目录下面
cd /usr/local

# 下载
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.9.tgz

# 解压
sudo tar -zxvf mongodb-osx-ssl-x86_64-4.0.9.tgz

# 重命名为 mongodb 目录
sudo mv mongodb-osx-x86_64-4.0.9/ mongodb
```

### 添加配置文件
安装完成后，我们可以把 MongoDB 的二进制命令文件目录（安装目录/bin）添加到 PATH 路径中, 我的mac上使用的是zshrc的配置文件，所以需要在文件中添加这个配置

```sh
# mongodb path config
export PATH=/usr/local/mongodb/bin:$PATH
```

### 创建日志及数据存放的目录并赋予操作权限：
- 数据存放路径：

```sh
sudo mkdir -p /usr/local/var/mongodb
```

- 日志文件路径：
```sh
sudo mkdir -p /usr/local/var/log/mongodb
```

接下来要确保当前用户对以上两个目录有读写的权限：
```sh
sudo chown chupengfei /usr/local/var/mongodb
sudo chown chupengfei /usr/local/var/log/mongodb
```

### 启动MongoDB
接下来我们使用以下命令在后台启动 mongodb：

```sh
mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
```
- dbpath 设置数据存放目录
- logpath 设置日志存放目录
- fork 在后台运行

### 关闭程序
如何关闭mongo应用程序

```sh
# 1. 打开终端或命令提示符窗口。

# 2. 输入以下命令并按下回车键，以连接到MongoDB实例：
mongo

# 3. 在MongoDB shell中，输入以下命令并按下回车键，以关闭MongoDB：
use admin
db.shutdownServer();
```

## 使用docker-compose启动mongodb容器服务，并设置用户名和密码
在服务器上部署mongo服务还是需要注意，如果不设置用户名和密码，很有可能被别人公网盗取自己的数据库文件。

- 1、新建一个文件夹来管理mongodb的数据库容器卷，这里我创建的文件夹名称是 docker-mongo

- 2、进入docker-mongo文件夹，进件 docker-compose.yml 文件

- 3、文件中写入配置信息：

```yml
version: '3.1'
services:
  mongodb:
    image: mongo
    container_name: "mongodb5.0"
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: "username"
      MONGO_INITDB_ROOT_PASSWORD: "password"
    ports:
      - 27017:27017
    volumes:
      - ./mongodb_data:/data/db
      - ./mongodb_logs:/var/log/mongodb
```

- 4、根据配置文件启动容器

```sh
docker-compose up -d
```



