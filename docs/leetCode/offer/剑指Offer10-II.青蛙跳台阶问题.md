---
sidebar: auto
---

# 剑指 Offer10-II.青蛙跳台阶问题
[题目描述](https://leetcode.cn/problems/qing-wa-tiao-tai-jie-wen-ti-lcof/)

## 解题思路

这道题目本质上和斐菲波那切数列是一样的。

```js
/**
 * @param {number} n
 * @return {number}
 */
var numWays = function(n) {
let memo = [];
  memo[0] = 1;
  memo[1] = 1;
  for (let i = 2; i <= n;i++) {
    memo[i] = (memo[i-1]+ memo[i-2]) % 1000000007;
  }
  return memo[n]
};
```