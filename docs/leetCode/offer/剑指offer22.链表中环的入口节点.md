---
sidebar: auto
---

# 剑指offer22.链表中环的入口节点

标签：哈希表、链表、双指针

[题目描述](https://leetcode.cn/problems/c32eOV/)

## 解题思路

快慢指针

我们使用两个指针，fast与slow。它们起始都位于链表的头部。随后，slow 指针每次向后移动一个位置，而 fast 指针向后移动两个位置。如果链表中存在环，则 fast 指针最终将再次与slow 指针在环中相遇。

```js
var detectCycle = function(head) {
  if (head === null) {
    return null;
  }
  let slow = head, fast = head;
  
  while (fast !== null) {
    slow = slow.next;
    if (fast.next !== null) {
      fast = fast.next.next;
    } else {
      return null;
    }
    if (fast === slow) {
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr;
    }
  }
  return null;
};
```



