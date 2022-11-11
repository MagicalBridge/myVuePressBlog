---
sidebar: auto
---

# 剑指offer32-3.从上到下打印二叉树

[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xs0paj/)

## 解题方案
- 标签：双端队列、树的广度遍历
- 从 root 节点开始，每次取下一层的所有节点放入队列中，放入队列时如果层数为奇数，则依次放到当前层结果的尾部，达到从左到右的顺序打印效果。如果层数为偶数，则依次放到当前层结果的头部，达到从右向左的顺序打印效果。
- 时间复杂度：O(n)，空间复杂度：O(n)

算法流程
- 1、初始化结果集合 res，如果 root == null 则直接返回空的结果集。
- 2、初始化队列 queue，并将 root 添加到队列中
- 3、当队列不为空时，将当前 queue 中的所有值取出，构造每一层的结果 list
- 4、如果层数为奇数层，则进行尾插法，将结果按顺序在 list 尾部进行插入
- 5、如果层数为偶数层，则进行头插法，将结果按顺序在 list 头部进行插入
- 6、将当前层结果 list 加入到 res 中，最后返回 res

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  let res = [];
  if (root == null) {
    return res;
  }
  let queue = [];
  queue.push(root);

  while (queue.length != 0) {
    // 分层管理
    let list = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      // 取出当前节点
      let treeNode = queue.shift();
      // 区分奇数行还是偶数行
      if (res.length % 2 === 0) {
        list.push(treeNode.val);
      } else {
        list.unshift(treeNode.val);
      }
      
      if (treeNode.left !== null) {
        queue.push(treeNode.left);
      }
      if (treeNode.right !== null) {
        queue.push(treeNode.right);
      }
    }
    res.push(list);
  }
  return res;
};
```

