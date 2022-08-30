---
sidebar: auto
---

# 剑指Offer68-I.二叉搜索树的最近公共祖先
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/59am12/)

## 解题方案
- 标签：二叉搜索树
- 整体思路：
  - 祖先节点定义：当前节点的父节点，其父节点的父节点，只要当前节点在某一个节点的子树下，则可以称其为当前节点的祖先节点
  - 公共祖先定义：p、q节点都在某一个节点的子树下或者其自身，则可以称其为 p、q 节点的公共祖先节点
  - 最近公共祖先定义：从祖先节点的定义可以知道，如果 x 节点是 p、q 节点的公共祖先，那么 x 节点的祖先节点也一定是 p、q 节点的公共祖先，则距离 p、q 个节点深度最小的为最近公共祖先，**通常表现为 p、q 节点不在最近公共祖先的同一个子树上**。
  - 根据题意可知，树是二叉搜索树，所有的节点值唯一，则可以根据 p、q 节点不在最近公共祖先的同一个子树上的特征，进行循环遍历，找到结果

## 算法流程：
- 1、首先在同一个二叉树上的 p、q 节点一定存在最近公共祖先，所以定义一个循环直到找到该节点为止。
- 2、如果 `root.val > p.val && root.val > q.val`，说明 p、q 节点都在 root 节点的左子树上，令 `root = root.left`，继续查询
- 3、如果 `root.val < p.val && root.val < q.val`，说明 p、q 节点都在 root 节点的右子树上，令 `root = root.right`，继续查询
- 4、如果 root.val == p.val，说明 p 节点就是最近公共祖先
- 5、如果 root.val == q.val，说明 q 节点就是最近公共祖先
- 6、如果 root.val > p.val && root.val < q.val 或者 root.val < p.val && root.val > q.val，说明 root 节点就是最近公共祖先。

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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  while (true) {
    if (root.val > p.val && root.val > q.val) {
      root = root.left;
    } else if (root.val < p.val && root.val < q.val) {
      root = root.right;
    } else {
      return root;
    }
  }
};
```