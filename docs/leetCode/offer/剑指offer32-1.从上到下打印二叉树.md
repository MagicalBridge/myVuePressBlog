---
sidebar: auto
---

# 剑指offer32-1.从上到下打印二叉树
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xsnu0i/)

## 解题方案

### 思路：
- 标签：树的广度遍历
- 整体思路：广度遍历的最常见思路，就是使用队列按照层次存储，然后依次取出，达到按照每一层进行遍历的效果
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
  // 判空处理
  if(root === null) {
    return [];
  }
  // 初始化空的队列
  let queue = [];
  // 先将根节点放进去
  queue.push(root);
  // 初始化结果数组
  let ans = [];
  // 开始循环
  while(queue.length !== 0) {
    // 取出队列的头部元素
    let node = queue.shift();
    // 将值放入结果数组中
    ans.push(node.val);

    // 判断将左边的节点放进去
    if(node.left !== null) {
      queue.push(node.left);
    }
    // 将右边的节点放进去
    if(node.right !== null) {
      queue.push(node.right);
    }
  }
  return ans;
}
```