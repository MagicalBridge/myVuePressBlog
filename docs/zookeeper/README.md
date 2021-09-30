
---
sidebar: auto
---

# Zookeeper

## Zookeeper简介

Zookeeper 是一个开源的分布式的，为分布式应用提供协调服务的项目

Zookeeper 从设计模式的角度来理解，是一个基于观察者模式设计的分布式服务管理框架，它负责存储和管理大家都关心的数据，然后接收观察者的注册，一旦这些数据的状态发生变化，Zookeeper就就将负责通知已经在Zookeeper上注册的这些观察者做出相应的反应。

Zookeeper = 文件系统+通知机制

