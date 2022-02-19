输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

例如:
给定的树 A:
```
     3
    / \
   4   5
  / \
 1   2
```

给定的树 B：
```
   4 
  /
 1
```

返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

```
示例 1：
输入：A = [1,2,3], B = [3,1]
输出：false
```

```
示例 2：
输入：A = [3,4,5,1,2], B = [4,1]
输出：true
```

## 解题思路
如果树B是树A的子结构，则子结构的根节点可能为树A的任意一个节点，因此，判断树B是否是树A的子结构，需要完成以下两步功能：
- 先序遍历 A 中的每个节点 nA, （对应函数 isSubStructure(A, B)）
- 判断树A中以 nA 为根节点的子树是否包含树B （对应函数 recur(A, B)）

## 算法流程
recur(A, B）函数:
- 1 终止条件:
  - 当节点B为空：说明树B已经匹配完成(越过子叶节点)，因此返回true；
  - 当节点A为空：说明已经越过A叶子节点，即匹配失败，返回falss；
  - 当节点A和B的值不相同；说明匹配失败，返回false。
- 2 返回值：
  - 判断A和B的左子节点是否相等，即recur(A.left, B.left)
  - 判断A和B的右子节点是否相等，即recur(A.right, B.right) 

isSubStructure(A, B) 函数：
- 1 特例处理：当树A为空 或者 树B 为空时候，直接返回 false
- 2 返回值： 返回值： 若树 B 是树 A 的子结构，则必满足以下三种情况之一，因此用或 || 连接；  
  -  以 节点 A 为根节点的子树 包含树 B ，对应 recur(A, B)
  -  树 B 是 树 A 左子树 的子结构，对应 isSubStructure(A.left, B)
  -  树 B 是 树 A 右子树 的子结构，对应 isSubStructure(A.right, B)

```js
function isSubStructure (A, B) {
  return ((A != null && B != null) && (recur(A, B)) || isSubStructure(A.left, B) || isSubStructure(A.right, B))
}
function recur(A, B) {
  if(B == null) return true;
  if(A == null || A.val != B.val) return false;
  return recur(A.left, B.left) && recur(A.right, B.right);
}
```