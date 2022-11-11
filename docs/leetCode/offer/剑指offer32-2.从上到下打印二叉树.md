---
sidebar: auto
---

# 剑指offer32-2.从上到下打印二叉树
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xswwvg/)

## 解题方案
这道题目本质上就是二叉树的层序遍历

### 思路：
- 标签: 树的广度遍历
- 通过广度遍历BFS，可以进行每一层的节点值获取，通过队列的方式，将当前层节点的下一层子节点放入队列中，用于下一次循环取值，同时将本层的节点放入到本层数组中，当前层循环结束后塞入结果数组中
- 时间复杂度：O(n)，空间复杂度：O(n)

### 算法流程：
- 1、初始化队列queue和结果res
- 2、当root === null 时候，直接返回空的结果集
- 2、将root添加到queue中，用于下面第一层循环
- 4、当queue不为空时候，始终进行循环遍历，新建当前层结果集 level，并将 queue 中当前层的节点一一取出，将节点值添加到 level 中，如果节点存在左子树，则将左子树节点放入 queue 中，如果节点存在右子树，则将右子树节点放入 queue 中
- 5、结束循环，返回结果集 res

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
var levelOrder = function(root) {
  let queue = [];
  let res = [];
  
  if(root == null) {
    return res;
  }
  
  queue.push(root);
  
  while(queue.length !== 0) {
    // 每一层都需要一个数组存储
    let level = [];
    const len = queue.length;
    
    for(let i = 0; i < len; i++) {
      // 拿出当前的元素
      let treeNode = queue.shift();
      level.push(treeNode.val);
      if(treeNode.left !== null) {
        queue.push(treeNode.left);
      }
      if(treeNode.right !== null) {
        queue.push(treeNode.right);
      }
    }
    // 一层完成之后放进数组中
    res.push(level);
  }
  return res;
};
```