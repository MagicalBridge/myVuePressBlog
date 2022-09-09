---
sidebar: auto
---

# 剑指Offer63.股票的最大利润
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/5w5qjr/)

## 解题方案
- 标签：动态规划
- 整体思路：根据题意，如果将第x天买，第y天卖进行穷举的话，需要的时间复杂度是很高的，所以使用动态规划来降低。
- 复杂度:
  - 时间复杂度O(n)：动态规划只需要遍历一次数组
  - 空间复杂度O(1)：只需要记录最小花费和最大收益

## 算法流程
- 1、状态定义：F(n) 表示 prices 中 0-n 下标子数组的最大利润
- 2、状态方程：
  - 前n天的最大利润 = max(前 n-1 天的最大利润，第n天的价格 - 前n天的最低价格)
  - F(n) = max(F(n−1), min(prices[n],minCost))
- 3、初始状态 F(0) = 0
- 4、其中只需要记录 minCost 和 F(n-1) 这两个内容即可，不需要留存之前的动态规划记录，进而将空间复杂度从O(n)降低到了O(1)

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  // 将花费设置成最大值
  let minCost = Number.MAX_SAFE_INTEGER;
  // 最大利润不能是复数
  let maxBenefit = 0;
  // 遍历数组
  for(const price of prices) {
    // 每次更新最小值
    minCost = Math.min(minCost, price);
    // 状态转移方程
    maxBenefit = Math.max(maxBenefit, price - minCost);
  }
  return maxBenefit;
};
```