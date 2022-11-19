---
sidebar: auto
---

# Compose 简介
Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。

## Compose 使用的三个步骤
- 使用Dockerfile 定义应用程序的运行环境
- 使用 docker-compose.yml 定义构成应用程序的服务，这样它们可以在隔离环境中一起运行
- 最后，执行 docker-compose up 命令来启动并运行整个程序。

## 配置示例
新建 `docker-compose.yml` 文件。以redis为例，演示多个容器如何关联。

```yml
version: '3'
services:
  editor-server: # service name
    build:
      context: .  # 当前目录
      dockerfile: Dockerfile # 基于Dockerfile 构建
    image: editor-server # 依赖于当前 Dockerfile 创建出来的镜像
    container_name: editor-server
    ports:
      - 8081:3000 # 宿主机通过8081端口访问
  editor-redis: # service name 这个名字可以自己取
    image: redis # 引用官方的 redis 镜像
    container_name: editor-redis # 容器的名称
    ports: 
      # 宿主机 可以使用 127.0.0.1：6378 即可连接容器中的数据库  
      # 但是其他的docker容器不能 也就是说 editor-server 是没有办法通过127.0.0.1：6378访问的
      - 6378:6379
    environment:
      - TZ=Aaia/Shanghai # 设置时区 
```

- 构建容器命令：`docker-compose build <service-name>`
- 启动所有的服务 docker-compose up -d  后台启动
- 停止所有的服务 docker-compose down
- 查看服务 docker-compose ps # 这个只会列举出当前 docker-compose.yml 所在文件的中服务

在服务的配置文件中，将redis的配置文件中的host修改成 editor-redis 这个名字一定要和  docker-compose.yml 中redis的 service 一样。

## 在阿里云上使用docker部署nginx

我的这个博客就是部署在阿里云上的。

## 连接MySql 和 Mongodb
和redis不同之处在于，redis 是缓存 而 MySql 和 Mongodb是数据库 需要数据持久化

基于之前yml文件，我们需要配置mysql

```yml
version: '3'
services:
  editor-server: # service name
    build:
      context: .  # 当前目录
      dockerfile: Dockerfile # 基于Dockerfile 构建
    image: editor-server # 依赖于当前 Dockerfile 创建出来的镜像
    container_name: editor-server
    ports:
      - 8081:3000 # 宿主机通过8081端口访问
  editor-redis: # service name 这个名字可以自己取
    image: redis # 引用官方的 redis 镜像
    container_name: editor-redis # 容器的名称
    ports: 
      # 宿主机 可以使用 127.0.0.1：6378 即可连接容器中的数据库  
      # 但是其他的docker容器不能 也就是说 editor-server 是没有办法通过127.0.0.1：6378访问的
      - 6378:6379
    environment:
      - TZ=Aaia/Shanghai # 设置时区 
  editor-mysql:
    image: mysql # 引用官方的镜像
    container_name: editor-mysql
    restart: always # 出错就重启服务
    privileged: true # 高权限 执行下面的  mysql/init
    command: --default-authentication-plugin=mysql_native_password # 远程访问
    ports:
      - 3305:3306 # 宿主机可以用 3305访问 
    volumes: 
      - .docker-volumes/mysql/log:/var/log/mysql # 记录日志
      - .docker-volumes/mysql/data:/var/lib/mysql # 数据持久化
      - .mysql/init:/docker-enterypoint-initdb.d/ # 初始化sql 
    environment:
      - MYSQL_DATABASE=imooc_lego_course # 数据库名称
      - MYSQL_ROOT_PASSWORD=Mysql_2019 # 密码
      - TZ=Aaia/Shanghai # 设置时区 
  editor-mongo:
    image: mongo # 引用官方的镜像
    container_name: editor-mongo # 容器名称
    restart: always # 出错就重启服务
    valumes: 
      - .docker-volumes/mongo/data:/data/db  # 容器卷的数据持久化
    environment:
      - MONGO_INITDB_DATABASE=imooc_lego_course
      - TZ=Aaia/Shanghai # 设置时区 
    ports:
      - 27016:27017 # 宿主机可以用27016访问 
```

## 测试机部署实战
- 使用github action 监听dev分支的push
- 登录测试机，获取最新的dev分支代码
- 重新构建镜像 docker-compose build editir-server
- 重启所有容器 docker-compose up -d

## 具体步骤：
新建 deploy-dev.yml 内容如下:
```yml
name: deploy for dev
on:
  push:
    branches:
      - dev # 只针对 dev 分支做这个事情
    paths:
      - .github/workflows/*
      - src/**
      - Dockfile
      - docker-compose.yml
      - bin/*
jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    steps: 
      - uses: actions/checkout@v2
      - name: set ssh key # 临时设置 ssh key
        run: |
          mkdir -p ~/.ssh/
          echo ""
```








