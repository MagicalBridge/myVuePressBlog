---
sidebar: auto
---

# redis

## redis 简介
Redis 是完全开源免费的，遵守BSD协议，是一个高性能的key-value数据库。

## redis的优势
- 性能极高 – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制的字符串、列表、哈希值、集合和有序集合等数据类型操作。
- 原子性 – Redis的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行
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




