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







