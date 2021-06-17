---
sidebar: auto
---

# MySql

## 1、SQL的概念

### 1.1 什么是SQL
Structured Query Language 结构化查询语言

### 1.2 SQL作用
1) 是一种所有关系型数据库的查询规范，不同的数据库都支持。
2) 通用的数据库操作语言，可以用在不同的数据库中。
3) 不同的数据库SQL语句有一些区别。

### 1.3 SQL语句的分类
1) Data Definition Language (DDL 数据定义语言) 如：建库，建表
2) Data Manipulation Language(DML 数据操纵语言)，如：对表中的记录操作增删改
3) Data Query Language(DQL 数据查询语言)，如：对表中的查询操作
4) Data Control Language(DCL 数据控制语言)，如：对用户权限的设置

### 1.4 MySQL的语法

1）每条语句以分号结尾，如果在数据库可视化工具中不是必须加的。
2）SQL 中不区分大小写，关键字中认为大写和小写是一样的。
3）3种注释：
|  注释的语法  | 说明  |
|  -----  |  -----  |
| --空格   | 单行注释 |
| /* */   | 多行注释 |
| #       | 这是mysql特有的注释方式 |


## 2、DDL操作数据库

### 2.1 创建数据库

#### 2.1.1 创建数据库的几种方式

- 创建数据库
```sql
CREATE DATABASE 数据库名;
```

- 判断数据库是否已经存在，不存在则创建数据库
```sql
CREATE DATABASE IF NOT EXISTS 数据库名;
```

- 创建数据库并指定字符集
```sql
CREATE DATABASE 数据库名 CHARACTER SET 字符集;
```

#### 2.1.2 具体操作 
```sql
-- 直接创建数据库 db1
create database db1;
-- 判断是否存在，如果不存在则创建数据库 db2
create database if not exists db2;
-- 创建数据库并指定字符集为 gbk
create database db3 default character set gbk;
```

### 2.2 查看数据库

```sql
-- 查看所有的数据库
show databases;

-- 查看某个数据库的定义信息
show create database db3;
show create database db1;
```


