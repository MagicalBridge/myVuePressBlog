---
sidebar: auto
---

# sentry

## Sentry 简介

Sentry 是一套开源的实时异常收集、追踪、监控系统，可以为开发者的提供帮助、诊断，修复和优化其代码的性能的能力，可以用它来监控线上服务的健康状态，实时收集的异常堆栈信息可以帮助我们快速发现、定位和修复问题。这套解决方案由对应各种语言的 SDK 和一套庞大的数据后台服务组成。通过 SDK 在客户端把异常数据、性能指标等信息上报到数据服务之后，会通过过滤、关键信息提取、归纳展示在管理后台的界面中。然后我们可以在管理后台界面中实时查看应用的异常状态。Sentry 还可以第一时间将报错的信息：页面路由、异常文件、请求方式等一些非常详细的信息以消息或者邮件的方式通知我们。

## 为什么选择Sentry？
在市场上有许多供应商提供类似的一体化解决方案，国外有 BugSnag、 RollBar，国内有 oneapm、fundebug、神策等，那为什么我们偏偏选择 Sentry 呢？

因为 Sentry 是 100% 开源的，我们可以使用它的 SaaS 版的，除此之外我们也可以私有化部署。

另外 Sentry 支持主流的编程语言。

## 下载Sentry docker 仓库并部署

Sentry 的管理后台是基于 Python Django 开发的。这个管理后台由背后的 Postgres 数据库（管理后台默认的数据库）、ClickHouse（存数据特征的数据库）、relay、kafka、redis 等一些基础服务或由 Sentry 官方维护的总共 23 个服务支撑运行。如果独立的部署和维护这 23 个服务将是异常复杂和困难的。幸运的是，官方提供了基于 docker 镜像的一键部署实现: getsentry/self-hosted。

### 下载
```sh
git clone https://github.com/getsentry/self-hosted
```

根据文档说明，部署sentry对服务器的要求挺高:
- Docker 19.03.6+
- Compose 1.28.0+
- 4 CPU Cores
- 8 GB RAM
- 20 GB Free Disk Space

### 检查自己的服务器配置

#### docker版本:
我进入自己的阿里云服务器，检查自己的配置：
```sh
$ docker --version
Docker version 20.10.10, build b485636 
```

我得docker版本符合要求。

#### 检查自己的 docker-compose 版本
```sh
$ docker-compose --version
docker-compose version 1.29.2, build 5becea4c
```






