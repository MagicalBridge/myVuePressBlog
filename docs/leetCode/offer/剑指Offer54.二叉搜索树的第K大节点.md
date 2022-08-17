---
sidebar: auto
---

# 剑指Offer54.二叉搜索树的第K大节点

## 解题方案：

思路：
- 标签：树的深度遍历
- 整体思路：二叉搜索树按照中序遍历可以获得升序的数字排列，题目要求第K大的节点，所以需要数字降序排列，则将中序遍历按照右、中、左遍历即可，遍历的同时找到第K个遍历到的值。
- 时间复杂度O(n) 空间复杂度O(1)。

算法流程：
- 1、初始化全局变量curK = k 用于之后的比较
- 2、进行树的右、中、左的深度遍历
  - 终止条件：root 节点为null，说明已经到了叶子节点
  - 右子树进行递归遍历
  - curK 自减 1，用于计数，当curK为0的时候表示找到了第K大的节点，则可以结束
  - 左子树进行递归遍历

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
 * @param {number} k
 * @return {number}
 */

let res, curK;

var kthLargest = function(root, k) {
  curK = k;
  dfs(root);
  return res;
};

var dfs = (root) => {
  if(root == null) {
    return;
  }
  dfs(root.right);
  if(curK == 0) {
    return;
  }
  curK--;
  if(curK == 0) {
    res = root.val;
  }
  dfs(root.left);
}
```