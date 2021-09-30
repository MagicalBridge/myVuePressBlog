---
sidebar: auto
---

# Lunix

## 一、Linux的概述：

先了解下Unix

Unix是一个强大的多用户、多任务操作系统。于1969年在AT&T的贝尔实验室开发。UNIX的商标权由国际开放标准组织（The Open Group）所拥有。UNIX操作系统是商业版，需要收费，价格比Microsoft Windows正版要贵一些。

Linux的概述：

Linux是基于Unix的Linux是一种自由和开放源码的操作系统，存在着许多不同的Linux版本，但它们都使用了Linux内核。Linux可安装在各种计算机硬件设备中，比如手机、平板电脑、路由器、台式计算机

诞生于1991 年10 月5 日。是由芬兰赫尔辛基大学学生Linus Torvalds和后来加入的众多爱好者共同开发完成。

## 二、Linux的常用命令

### 1、切换目录命令

### 重命名一个文件
```shell
$mv sourcename  targetname ny-nginx

# 创建一个文件夹, 命名为 ny-nginx 突然发现是写错了
$mkdir ny-nginx

# 修改文件名称 改为 my-nginx
$mv ny-nginx my-nginx 
```

## scp 跨机远程拷贝

scp是secure copy的简写，用于在Linux下进行远程拷贝文件的命令，和它类似的命令有cp，不过cp只是在本机进行拷贝不能跨服务器，而且scp传输是加密的。当你服务器硬盘变为只读 read only system时，用scp可以帮你把文件移出来。

> 类似的工具有rsync；scp消耗资源少，不会提高多少系统负荷，在这一点上，rsync就远远不及它了。rsync比scp会快一点，但当小文件多的情况下，rsync会导致硬盘I/O非常高，而scp基本不影响系统正常使用。

### 命令格式
```shell
$scp [参数] [原路径] [目标路径]
```

### 使用示例

#### 1、从远处复制文件到本地目录
```shell
$scp root@10.6.159.147:/opt/soft/demo.tar /opt/soft/
```

说明： 从10.6.159.147机器上的/opt/soft/的目录中下载demo.tar 文件到本地/opt/soft/目录中

#### 2、从远处复制到本地
```shell
$scp -r root@10.6.159.147:/opt/soft/test /opt/soft/
```
说明： 从10.6.159.147机器上的/opt/soft/中下载test目录到本地的/opt/soft/目录来。

#### 3、上传本地文件到远程机器指定目录
```shell
$scp /opt/soft/demo.tar root@10.6.159.147:/opt/soft/scptest
```
说明： 复制本地opt/soft/目录下的文件demo.tar 到远程机器10.6.159.147的opt/soft/scptest目录

#### 4、上传本地目录到远程机器指定目录
```shell
$scp -r /opt/soft/test root@10.6.159.147:/opt/soft/scptest
```
说明： 上传本地目录 /opt/soft/test到远程机器10.6.159.147上/opt/soft/scptest的目录中

