---
sidebar: auto
---

# 剑指offer24.反转链表

## 标签：递归、链表

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

示例：
```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

限制：
0 <= 节点个数 <= 5000

### 方法一：迭代
假设存在链表 `1 -> 2 -> 3 -> ∅`  我们想要把它改成 `∅ <- 1 <- 2 <- 3`,在遍历链表时，将当前的节点的next指针改为指向前一个元素，由于节点没有引用其上一个节点，因此必须事先存储前一个元素。在更改引用前，还需要另一个指针来存储下一个节点，不要忘记在最后返回新的头引用。

动画图示：
![反转链表](../../images/leetcode/206/01.gif)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  // 前置节点，作为新链表的尾部
  let pre = null;
  // 这个变量用于不断的移动指针。 
  let cur = head;
  while(cur !== null) {
    let next = cur.next; // 需要先记录下来当前节点的后指针 否则翻转之后找不到了
    // 开始翻转
    cur.next = pre; // 当前指针指向前置节点;
    pre = cur; // pre 移动到 cur节点；
    cur = next; // cur 移动到next 
  }
  // 退出while循环的条件是 cur为null，只要记住
  // pre 是指向null的前一个元素，所以翻转之后返回的应该是pre
  return pre
};
```