描述
将一个节点数为 size 链表 m 位置到 n 位置之间的区间反转，要求时间复杂度 O(n)，空间复杂度 O(1)。

例如：
给出的链表为 1 -> 2 -> 3 -> 4 -> 5 -> NULL m=2,n=4。

返回 1 → 4 → 3 → 2 → 5 → NULL。


示例1
```
输入：{1,2,3,4,5},2,4

返回值：{1, 4, 3, 2, 5}
```

## 解法一：双指针（两次遍历）

思路步骤：
- 要翻转链表，可已将该局部部分当做完整的链表进行翻转
- 再将已经翻转好的局部链表与其他节点建立链接，重构链表
- 建议使用虚拟头结点的技巧，可以避免对头结点复杂的分类考虑，简化操作。

这种解法方便理解：比较直观

```js
/*
 * function ListNode(x){
 *   this.val = x;
 *   this.next = null;
 * }
 */

/**
  * 
  * @param head ListNode类 
  * @param m int整型 
  * @param n int整型 
  * @return ListNode类
  */
function reverseBetween( head ,  m ,  n ) {
  // 设置虚拟头节点
  let dummyNode = new ListNode(-1)
  // 将虚拟头节点和链表相连
  dummyNode.next = head
  // 设置前面一个指针
  let pre = dummyNode
  // 1、走left-1步，走到left前一个节点
  for (let i = 0; i < m-1; i++) {
    pre = pre.next
  }
  
  // 2、走 right-left+1 步走到 right 节点
  let rightNode = pre
  for (let i = 0; i < n - m + 1;i++) {
    rightNode = rightNode.next
  }

  // 截取出来一个子链表
  let leftNode = pre.next
  let cur = rightNode.next

  // 切断连接
  pre.next = null
  rightNode.next = null

  // 翻转局部链表
  reverseLinkList(leftNode)
  // 接回原来的链表
  pre.next = rightNode
  leftNode.next = cur
  return dummyNode.next
}

// 翻转链表辅助函数
function reverseLinkList(head) {
  let pre = null
  let cur = head
  while(cur!== null) {
    cur_next = cur.next
    cur.next = pre
    pre = cur
    cur = cur_next
  }
}
module.exports = {
  reverseBetween : reverseBetween
};
```
