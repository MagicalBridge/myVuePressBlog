## 前言

最早在2020年的时候，我就使用过阿里云部署过easy-mock，当时印象非常深刻。当时是以安装包的形式分别安装了 mongodb、redis，nginx。

部署完毕之后，使用了挺长一段时间。

在2021年10月份，自己将docker的学习重新提上议程。

[easy-mock GitHub地址](https://github.com/easy-mock)

## 服务器配置
我的服务器配置是 1核 1GB 部署easy-mock确实足够使用了。

因为全部采用docker部署、还需要使用docker-compose去统一编排，所以需要在阿里云上安装 docker 和 docker-compose

## 新建目录
为了后期方便管理，我在服务器上创建文件夹，并进入文件夹
```bash
mkdir /usr/local/docker/easy-mock
cd /usr/local/docker/easy-mock
```

## 创建docker-compose.yml文档
```shell
vim docker-compose.yml
```
在文件中增加以下内容
```yml
version: '3'

services:
  mongodb:
    image: mongo:3.4.1
    volumes:
      # ./data/db 数据库文件存放地址，根据需要修改为本地地址
      - './data/db:/data/db'
    networks:
      - easy-mock
    restart: always

  redis:
    image: redis:4.0.6
    command: redis-server --appendonly yes
    volumes:
      # ./data/redis redis 数据文件存放地址，根据需要修改为本地地址
      - './data/redis:/data'
    networks:
      - easy-mock
    restart: always

  web:
    image: easymock/easymock:1.6.0
    command: /bin/bash -c "npm run dev"
    ports:
      - 7300:7300
    volumes:
      # 日志地址，根据需要修改为本地地址
      - './logs:/home/easy-mock/easy-mock/logs'
      # 配置地址，请使用本地配置地址替换
      # - './production.json:/home/easy-mock/easy-mock/config/production.json'
    networks:
      - easy-mock
    restart: always

networks:
  easy-mock:
```

## 创建自定义配置文档

```json
{
  "port": 7300,
  "host": "0.0.0.0",
  "pageSize": 30,
  "proxy": false,
  "db": "mongodb://mongodb/easy-mock",
  "unsplashClientId": "",
  "redis": {
    "keyPrefix": "[Easy Mock]",
    "port": 6379,
    "host": "redis",
    "password": "",
    "db": 0
  },
  "blackList": {
    "projects": [], // projectId, e.g."5a4495e16ef711102113e500"
    "ips": [] // ip, e.g. "127.0.0.1"
  },
  "rateLimit": { // https://github.com/koajs/ratelimit
    "max": 1000,
    "duration": 1000
  },
  "jwt": {
    "expire": "14 days",
    "secret": "shared-secret"
  },
  "upload": {
    "types": [".jpg", ".jpeg", ".png", ".gif", ".json", ".yml", ".yaml"],
    "size": 5242880,
    "dir": "../public/upload",
    "expire": {
      "types": [".json", ".yml", ".yaml"],
      "day": -1
    }
  },
  "fe": {
    "copyright": "",
    "storageNamespace": "easy-mock_",
    "timeout": 25000,
    "publicPath": "/dist/"
  }
}
```

## 使用docker-compose启动

- 确保在docker-compose.yml所在的目录

在后台启动easy-mock，执行命令

```shell
docker-compose up -d
```

终端输出的命令：
```shell
Pulling mongodb (mongo:3.4.1)...
3.4.1: Pulling from library/mongo
5040bd298390: Already exists
ef697e8d464e: Already exists
67d7bf010c40: Already exists
bb0b4f23ca2d: Already exists
8efff42d23e5: Already exists
11dec5aa0089: Already exists
e76feb0ad656: Already exists
5e1dcc6263a9: Already exists
2855a823db09: Already exists
Digest: sha256:aff0c497cff4f116583b99b21775a8844a17bcf5c69f7f3f6028013bf0d6c00c
Status: Downloaded newer image for mongo:3.4.1
Pulling redis (redis:4.0.6)...
4.0.6: Pulling from library/redis
c4bb02b17bb4: Already exists
58638acf67c5: Already exists
f98d108cc38b: Already exists
83be14fccb07: Already exists
5d5f41793421: Already exists
ed89ff0d9eb2: Already exists
Digest: sha256:0e773022cd6572a5153e5013afced0f7191652d3cdf9b1c6785eb13f6b2974b1
Status: Downloaded newer image for redis:4.0.6
Starting easy-mock_mongodb_1 ... done
Starting easy-mock_redis_1   ... done
Creating easy-mock_web_1     ... done
```

如果之前部署过这个项目，重新部署的时候，先删除一下 data 文件夹和log文件夹，但是如果这样处理，就没有办法保存数据了。

## 给自己的服务器配置反向代理
如果不是使用docker形式部署，即使不配置nginx网站也是可以正常访问的。
但是采用docker这种形式部署之后，不配置代理，会出现访问不了的问题。

## 


