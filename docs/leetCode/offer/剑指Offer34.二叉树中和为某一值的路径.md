给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

叶子节点 是指没有子节点的节点。

```
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出：[[5,4,11,2],[5,8,4,5]]

输入：root = [1,2,3], targetSum = 5
输出：[]

输入：root = [1,2], targetSum = 0
输出：[]
```

解题思路：
> 本问题是典型的二叉树方案的搜索问题，使用回溯法解决，包含先序遍历+路径记录两个部分。

- 先序遍历：按照根、左、右的顺序，遍历树的所有节点
- 路径记录：在先序遍历中，记录从根节点到当前节点的路径。当路径为结果刚好为目标值的时候。将这个路径加入结果列表。

算法流程：
pathSum(root,sum)函数
- 初始化: 结果列表 res 路径列表 path
- 返回值：返回 res 即可

recur(root,tar) 函数
- 递推参数 当前节点 root 当前目标值 tar
- 终止条件：若节点 root 为空 则直接返回
- 递推工作：
  - 路径更新：将当前的节点值 root.val 加入 path
  - 目标值更新：tar = tar - root.val
  - 路径记录：当路径和等于目标值，则将此路径path加入 res
  - 先序遍历：递归左右子节点
  - 路径恢复：向上回溯前，需要将当前节点从路径 path 中删除 执行 path.pop()

```js 
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} target
 * @return {number[][]}
 */
var pathSum = function(root, target) {
	if (!root) return [];
	let res = [];
  
  function dfs(node, sum, path) {
		if (!node) return false;
		
    let {left, right, val} = node;
		path.push(val);
		
    if (val === sum && !left && !right) res.push(path);
		
    dfs(left, sum - val, path.slice());
		dfs(right, sum - val, path.slice());
	}

	dfs(root, target, []);
	return res;
};
```


