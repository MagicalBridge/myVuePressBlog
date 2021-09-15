题目描述:

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字

```
示例 1：
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
```
```
示例 2：
输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
输出：[1,2,3,4,8,12,11,10,9,5,6,7]
```

## 思路
- 标签：二维数组
- 整体思路：循环遍历整个数组，循环中再嵌套四个循环，分别是从左到右，从上到下，从右向左，从下到上，这几个方向，按照题目给定的意思将整个数组遍历完成，控制好边界条件。

## 算法流程
- 1 题目中 matrix 有可能为空，直接返回空数组即可
- 2 初始化边界 left right top bottom 四个值，初始化的结果数组 res和数组下标 x 
- 3 按照遍历方向 循环取出数字放入结果数组中
  - 从左到右：遍历完成后 ++top，如果 top > bottom​，到达边界循环结束
  - 从上至下：遍历完成后 --right，如果 left > right​，到达边界循环结束
  - 从右至左：遍历完成后 --bottom，如果 top > bottom​，到达边界循环结束
  - 从下至上：遍历完成后 ++left，如果 left > right​，到达边界循环结束

```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  if(matrix.length == 0) return [];
  let left = 0, right = matrix[0].length - 1, top = 0, bottom = matrix.length - 1, x = 0;
  let res = [];
  while(true) {
    for(let i = left; i <= right; i++) {
      res[x++] = matrix[top][i];
    }
    if(++top > bottom) break;

    for(let i = top; i <= bottom; i++) {
      res[x++] = matrix[i][right];
    }
    if(left > --right) break;

    for(let i = right; i >= left; i--) {
      res[x++] = matrix[bottom][i];
    }
    if(top > --bottom) break;

    for(let i = bottom; i >= top; i--) {
      res[x++] = matrix[i][left];
    }
    if(++left > right) break;
  }
  return res;
};
```