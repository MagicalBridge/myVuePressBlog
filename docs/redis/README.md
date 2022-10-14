---
sidebar: auto
---

# redis
[参考文档](http://www.zhufengpeixun.com/strong/html/33.redis.html)


## redis 简介
Redis 是完全开源免费的，遵守BSD协议，是一个高性能的key-value数据库。

## redis的优势
- 性能极高 – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制的字符串、列表、哈希值、集合和有序集合等数据类型操作。
- 原子性 – Redis的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行。
- 单个操作是原子性的。多个操作也支持事务，即原子性，通过MULTI和EXEC指令包起来。
- 丰富的特性 – Redis还支持 发布/订阅, 通知, key 过期等等特性。

## 数据类型
- 字符串
- 哈希值
- 链表
- 集合
- 有序列表

## 字符串
字符串是最基本的类型 一个key对应一个value

### SET 设置值
```js
SET name 褚鹏飞
```

### GET 获取值
```js
GET name
```

### GETRANGE 获取子串
Redis Getrange 命令用于获取存储在指定 key 中字符串的子字符串。字符串的截取范围由 start 和 end 两个偏移量决定(包括 start 和 end 在内)。

```js
// GETRANGE key start end 
getrange name 1 2
"鹏飞"
```

### INCR 递增
```js
SET page_view 20
INCR page_view 
GET page_view  // "21" 数字值在 redis 中以字符串的形式保存 
```

### 键的常用操作
```js
DEL key  删除某一个键 
DEL user // 删除 user 这个键

EXISTS key 判断一个key是否存在
EXISTS user // 删除之后返回0

EXPIRE key seconds 设置过期时间
EXPIRE user 10  // 设置user 这个键10秒钟 就过期

TTL key 以秒为单位返回给定key的剩余生存时间
TTL user // 查看user的还有多久过期

TYPE key 返回key所存储的值的类型
TYPE user // 返回string

```
还有一些常用的处理键值对的方法：
[Redis字符串命令](https://www.runoob.com/redis/redis-strings.html)

## 哈希值
主要用于存储对象

### HSET HMSET 设置值

```js
HSET person name 设置单个值 
HMSET user name zfpx age 9  设置多个值
```

## 列表
Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）

```sh
redis 127.0.0.1:6379> LPUSH runoobkey redis
(integer) 1
redis 127.0.0.1:6379> LPUSH runoobkey mongodb
(integer) 2
redis 127.0.0.1:6379> LPUSH runoobkey mysql
(integer) 3
redis 127.0.0.1:6379> LRANGE runoobkey 0 10

1) "mysql"
2) "mongodb"
3) "redis"
```

在以上实例中我们使用了 LPUSH 将三个值插入了名为 runoobkey 的列表当中。

### 列表命令
[常见的列表命令](https://www.runoob.com/redis/redis-lists.html)


## 集合(无序)
Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。

集合对象的编码可以是 intset 或者 hashtable。

Redis 中集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

```sh
redis 127.0.0.1:6379> SADD runoobkey redis
(integer) 1
redis 127.0.0.1:6379> SADD runoobkey mongodb
(integer) 1
redis 127.0.0.1:6379> SADD runoobkey mysql
(integer) 1
redis 127.0.0.1:6379> SADD runoobkey mysql
(integer) 0
redis 127.0.0.1:6379> SMEMBERS runoobkey

1) "mysql"
2) "mongodb"
3) "redis"
```
在以上实例中我们通过 SADD 命令向名为 runoobkey 的集合插入的三个元素。

### 集合中的常见命令：

- 查看集合中的所有成员 SMEMBERS key
- 获取集合的成员数量  SCARD key
- 返回给定所有集合的交集 SINTER key1 [key2]
- 返回所有给定集合的并集 SUNION key1 [key2]
- 返回第一个集合与其他集合之间的差异。SDIFF key1 [key2]


## 有序集合(sorted set)

Redis 有序集合和集合一样也是 string 类型元素的集合,且不允许重复的成员。

不同的是每个元素都会关联一个 double 类型的分数。redis 正是通过分数来为集合中的成员进行从小到大的排序。

有序集合的成员是唯一的,但分数(score)却可以重复。

```sh
redis 127.0.0.1:6379> ZADD runoobkey 1 redis
(integer) 1
redis 127.0.0.1:6379> ZADD runoobkey 2 mongodb
(integer) 1
redis 127.0.0.1:6379> ZADD runoobkey 3 mysql
(integer) 1
redis 127.0.0.1:6379> ZADD runoobkey 3 mysql
(integer) 0
redis 127.0.0.1:6379> ZADD runoobkey 4 mysql
(integer) 0
redis 127.0.0.1:6379> ZRANGE runoobkey 0 10 WITHSCORES

1) "redis"
2) "1"
3) "mongodb"
4) "2"
5) "mysql"
6) "4"
```


