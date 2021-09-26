---
sidebar: auto
---

# Kubernetes

## 什么是 Kubernetes 
- Kubernetes 可以看做是用来部署镜像的平台
- 可以用来操作多台机器部署镜像
- 在Kubernetes中，可以使用集群来组织服务器，集群会存在一个master节点，该节点是Kubernetes集群的控制节点，负责调度集群中其他服务器资源，其他节点被称之为node。

## 基础安装
- master & node节点都需要安装

### 安装必备组件
- vim 是 Linux 下的一个文件编辑器
- wget 可以用作文件下载使用
- ntpdate 则是可以用来同步时区

```shell
yum install vim wget ntpdate -y
```