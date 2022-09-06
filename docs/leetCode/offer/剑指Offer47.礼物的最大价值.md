---
sidebar: auto
---

# 剑指Offer47.礼物的最大价值
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xstkx3/)

## 解题方案：
- 标签：动态规划
- 整体思路：在遍历二维数组的时候，通过状态转移方程计算出当前位置的最大价值，同时通过复用入参来减少空间复杂度。
- 时间复杂度：O(m*n)，空间复杂度：O(1)

## 算法流程
- 1、初始化行数row和列数column,遍历二维数组进行动态规划
- 2、状态定义：状态转移二维数组为dp,dp[i][j]表示从 grid[0][0] 到 grid[i][j] 得到礼物的最大价值。
- 3、动态转移方程：
  - 当 i=0 && j=0 时，dp[0][0] = grid[0][0]
  - 当 i=0 && j!=0 时，dp[i][j] = grid[i][j] + dp[i][j-1]
  - 当 i!=0 && j=0 时，dp[i][j] = grid[i][j] + dp[i-1][j]
  - 当 i!=0 && j!=0 时，dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1])
- 4、初始状态：dp[0][0] = grid[0][0]
- 5、结果值：dp[row-1][column-1]，row 为二维数组行数，column 为二维数组列数。
- 6、空间上因为 dp 与 grid 大小一致，可以使用 grid 空间作为 dp 空间，减少空间复杂度。

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxValue = function(grid) {
  let row = grid.length;
  let column = grid[0].length;
  
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < column; j++) {
      if(i == 0 && j == 0) {
        continue;
      } else if(i == 0) {
        grid[i][j] += grid[i][j - 1] ;
      } else if(j == 0) {
        grid[i][j] += grid[i - 1][j];
      } else {
        grid[i][j] += Math.max(grid[i][j - 1], grid[i - 1][j]);
      }
    }
  }
  return grid[row - 1][column - 1];
};
```
