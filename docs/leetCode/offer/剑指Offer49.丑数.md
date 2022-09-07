---
sidebar: auto
---

# 剑指Offer49.丑数
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/50qoxc/)

## 解题方案
- 标签：动态规划
- 整体思路：
  - 除了第一个丑数外，所有的丑数都是某一个丑数的 2、3 或 5 倍的数字
  - 因为要从小到大求第 n 个丑数，所以需要按照顺序每次获取下一个最小的丑数，最终获得第 n 个
- 复杂度：
  时间复杂度：O(n)。只需要 n 次遍历即可求得第 n 个丑数
  空间复杂度：O(n)。需要保存动态规划的整体状态数组

## 算法流程
- 状态定义： dp[n] 表示第 n 个丑数，a 表示 2 倍数字的索引用于 `dp[a]*2`,b 表示 3 倍数字的索引用于 `dp[b]*3`,c 表示 5 倍数字的索引用于 `dp[c]*5`
- 转移方程：`dp[n] = min(dp[a]*2, dp[b]*3, dp[c]*5)`
- 每次计算之后，如果 2 倍的数字最小，则 a++，如果 3 倍的数字最小，则 b++，如果 5 倍的数字最小，则 c++

```js
/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function(n) {
  let a = 0, b = 0, c = 0;
  let dp = [];
  dp[0] = 1;
  for(let i = 1; i < n; i++) {
    let n2 = dp[a] * 2;
    let n3 = dp[b] * 3;
    let n5 = dp[c] * 5;
    dp[i] = Math.min(Math.min(n2, n3), n5);
    if(dp[i] == n2) {
      a++;
    }
    if(dp[i] == n3) {
      b++;
    }
    if(dp[i] == n5) {
      c++;
    }
  }
  return dp[n - 1];
};
```