# 剑指Offer06.从尾到头打印链表

## 题目描述 
输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

```
示例 1：
输入：head = [1,3,2]
输出：[2,3,1]
 
限制：
0 <= 链表长度 <= 10000
```

## 解题方案
栈的特点是先进后出，因为题目要求从尾到头打印元素，所以符合栈的特性
- 先遍历一遍链表，将链表中的元素存入到栈中
- 再不断弹出栈内元素，将弹出元素存放到结果数组中
- 也有使用递归来进行解题的，在此提出一个思考，递归和栈的关系是什么？其实递归的本质也是在使用栈，只不过是程序调用栈，因为没有显式在代码中体现出来，所以常常被忽略了
- 时间复杂度：O(n)，空间复杂度：O(n)

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
 * @return {number[]}
 */
var reversePrint = function(head) {
  // 创建辅助栈
  let stack = [];
  // 头结点赋值，
  let pointer = head;
  // 指针移动
  while (pointer != null) {
    stack.push(pointer.val);
    pointer = pointer.next;
  }
  
  const length = stack.length;
  let res = [];

  for (let i = 0; i < length; i++) {
    res.push(stack.pop());
  }
  return res;
};
```
