---
sidebar: auto
---

# 剑指offer27.二叉树的镜像

[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xsoekm/)


## 解题方案：

- 标签: dfs
- 递归结束条件：
  - 当节点 root 为 null 时，说明已经到叶子节点了，递归结束
- 递归过程：
  - 初始化当前节点，并且赋值
  - 递归原来树的右子树 mirrorTree(root.right)，并将该结果挂到当前节点的左子树上
  - 递归原来树的左子树 mirrorTree(root.left)，并将该结果挂到当前节点的右子树上
- 时间复杂度 O(n)，空间复杂度 O(n)

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
 * @return {TreeNode}
 */
var mirrorTree = function (root) {
  if (root == null) {
    return null;
  }
  let leftRoot = mirrorTree(root.right);
  let rightRoot = mirrorTree(root.left);
  root.left = leftRoot;
  root.right = rightRoot;
  return root;
};
```


```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function mirrorTree(root: TreeNode | null): TreeNode | null {
  if (root === null) {
    return null
  }

  let leftRoot: TreeNode = mirrorTree(root.right)
  let rightRoot: TreeNode = mirrorTree(root.left)
  root.left = leftRoot
  root.right = rightRoot
  return root  
};
```