---
sidebar: auto
---

# 面试题

## 面试题10.03 搜索旋转数组

搜索旋转数组，给定一个**排序后**的数组，包含n个整数，但这个数组已经被旋转过很多次了，次数不详。请编写代码找出数组中的某个元素，假设数组元素原先是按照升序排列的。若有多个相同的元素，返回索引值最小的一个。

示例1：
```
输入: arr = [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14], target = 5
输出: 8（元素5在该数组中的索引）
```

示例2：
```
输入：arr = [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14], target = 11
输出：-1 （没有找到）
```

思路: 二分查找

对于有序数组，可以使用二分查找的方法查找元素。 但是这道题目数组是旋转过后的