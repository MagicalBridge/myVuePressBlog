---
sidebar: auto
---

# Git

## 什么是版本控制系统（VCS）

很多人认为 Git 难以理解的第一个门槛在于：所谓的「Git 是一个分布式版本控制系统」这句话的具体含义不够清楚。其实分布式版本控制系统（Distributed Version Control System - DVCS）这个定义并不难，不过一步一步来，我先告诉你，什么是版本控制系统（Version Control System - VCS）。

### 版本控制：最基本功能
> 版本控制系统（VCS）最基本的功能是版本控制。所谓版本控制，意思就是在文件的修改历程中保留修改历史，让你可以方便地撤销之前对文件的修改操作。

最简化的版本控制模型，是大多数主流文本编辑器都有的「撤销（Undo）」功能：你本来想删除一个字符，却在按删除键之前不小心选中了全文，结果一下子整篇文档都被删光了，没关系，按一下「撤销」(Ctrl + Z 或 ⌘ + Z 或 U 等等，具体和你的操作系统以及编辑器有关），删掉的文字就都回来了。这其实是文本编辑器帮你自动保存了之前的内容，当你按下「撤销」的时候，它就帮你把内容回退到上一个状态；同理，按一次是会退到上一个版本，按两次就是回退到上上一个版本。

写程序的时候同样也难免会遇到「写错」的情况，所以程序的 VCS，当然也会需要版本控制功能，这样当你发现「昨天有一行代码写错了」，你就不用凭着记忆把那段代码背出来，而只需要在 VCS 中选择撤回到昨天的那个版本。


### centos安装git
安装命令：

```shell
yum install git
```

验证安装的git是否是可以使用的
```shell
git --version
git version 1.8.3.1
# 显示出来git的版本号说明安装成功
```

可以配置一些git的基本信息
```shell
# 配置用户名和邮箱
git config --global user.name "myname"
git config --global user.email xxxxxxxx@qq.com

# 查看配置信息
git config --list

user.name=myname
user.email=xxxxxxxx@qq.com
```

