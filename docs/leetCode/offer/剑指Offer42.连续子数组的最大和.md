---
sidebar: auto
---

# 剑指Offer42.连续子数组的最大和
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/xsus9h/)

## 解题方案
- 标签：动态规划
- 整体思路：通过动态规划计算每一个步骤的状态可以在遍历数组结束后得到结果，成为最优解
- 时间复杂度：O(n), 空间复杂度O(n)

## 算法流程
- 1、状态定义：动态规划数组为dp，dp[i] 表示以 nums[i] 结尾的连续子数组最大和
- 2、状态转移方程：
  - 当 dp[i - 1] > 0​ 时，则 ​dp[i] = dp[i-1] + nums[i]​，因为此时 ​dp[i - 1]​ 产生正向增益，所以要加上去
  - 当 dp[i - 1] ≤ 0​ 时，则 ​dp[i] = nums[i]​，因为此时 ​dp[i - 1]​ 产生负向增益，所以不需要添加
- 3、初始状态：dp[0] = nums[0]
- 4、结果值：dp数组中的最大值，就是最终的结果
- 5、其中为了降低空间复杂度，可以将 dp 数组与 nums 数组合并，避免开辟新的内存空间

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
// 每个元素都有两种选择和前面的数相加还是自己单干
// 所以可以很迅速的得出状态转移方程
// dp[i] = Math.max(dp[i-1]+nums[i], num[i]);
var maxSubArray = function (nums) {
  let len = nums.length;
  if (len === 0) {
    return 0
  }
  if (len === 1) {
    return nums[0];
  }
  let max = nums[0];
  let dp = new Array(len);
  dp[0] = nums[0]
  for (let i = 1; i < len; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    max = Math.max(dp[i], max);
  }
  return max
};
```

换一种解题思路

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let res = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] > 0) {
      nums[i] += nums[i - 1];
    }
    res = Math.max(res, nums[i]);
  }
  return res;
};
```