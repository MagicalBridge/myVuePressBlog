---
sidebar: auto
---

# 剑指offer32-1.从上到下打印二叉树
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xsnu0i/)

## 解题方案

### 思路：
- 标签：树的广度遍历
- 整体思路：广度遍历的最常见的思路，使用队列按照层次存储，然后依次取出，达到按照层次进行遍历的效果
- 时间复杂度：O(n) 空间复杂度 O(n)

算法流程：
  - 1、判断 root 是否为 null，如果为 null 则直接返回空数组
  - 2、初始化队列，并将初始的 root 节点加入队列之中
  - 3、当队列不为空时不断广度遍历二叉树，遍历时依次从队列中取出节点，取出后如果该节点存在左节点则将左节点放入队列中，如果该节点存在右节点则将右节点放入队列中
  - 4、在遍历过程中存储结果，最后将结果按照要求的格式返回

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
 * @return {number[]}
 */
var levelOrder = function(root) {
  if(root == null) {
    return [];
  }
  let queue = [];
  queue.push(root);
  let ans = [];
  while(queue.length != 0) {
    let node = queue.shift();
    ans.push(node.val);
    if(node.left != null) {
      queue.push(node.left);
    }
    if(node.right != null) {
      queue.push(node.right);
    }
  }
  return ans;
}
```