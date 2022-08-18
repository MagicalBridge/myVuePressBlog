---
sidebar: auto
---

# 剑指offer28.对称的二叉树

[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xsrxq1/)

## 解题方案：
- 标签：dfs
- 递归结束条件：
  - 都为空指针返回true
  - 只有一个为空返回为false
- 递归过程：
  - 判断两个指针当前节点的值是否相等
  - 判断A的右子树和B的左子树是否对称
  - 判断A的左子树与B的右右子树是否对称

- 短路：在递归判断过程中存在短路现象，也就是做与操作时，如果前面的值返回 false 则后面的不再进行计算

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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  return isMirror(root, root);
};

const isMirror = (t1, t2) => {
  if (t1 == null && t2 == null) return true;
  if (t1 == null || t2 == null) return false;
  return (
    t1.val == t2.val &&
    isMirror(t1.right, t2.left) &&
    isMirror(t1.left, t2.right)
  );
};
```

增加ts的解法
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

function isSymmetric(root: TreeNode | null): boolean {
  return isMirror(root, root)
};

const isMirror = (t1: TreeNode, t2: TreeNode): boolean => {
  if (t1 === null && t2 === null) {
    return true
  }
  if (t1 === null || t2 === null) {
    return false
  }

  return (t1.val === t2.val && isMirror(t1.right, t2.left) && isMirror(t1.left, t2.right))
}
```