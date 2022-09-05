---
sidebar: auto
---

# 剑指Offer46.把数字翻译成字符串
[题目描述](https://leetcode.cn/leetbook/read/illustrate-lcof/5jd1tc/)

## 解题方案

思路：
- 标签：动态规划
- 整体思路：
  - 翻译方案可能与前两步骤有关，令 dp[n] 表示第 n 个位置方案数量，第 [n] 位与区间 [0:n-1] 位必然可以组成 dp[n-1] 个方案，如果前两位 [n-1:n] 组成的数字在区间 10-26 之间，第 [n-1:n] 位与区间 [0:n-2] 位必然可以组成 dp[n-2]个方案，所以可以根据该思路写出动态规划方程。

- 复杂度：
  - 时间复杂度：O(n)。n 代表 num 的数字长度，需要遍历 n 次
  - 空间复杂度：O(n)。需要将 num 转为字符串，所以要消耗字符串长度 n 的空间

```js
/**
 * @param {number} num
 * @return {number}
 */
var translateNum = function(num) {
  let numStr = num.toString();
  let len = numStr.length;
  let x = 1;
  let y = 1;
  
  for(let i = 2; i <= len; i++) {
    let sub = numStr.substring(i - 2, i);
    let z = parseInt(sub) >= 10 && parseInt(sub) <= 25 ? x + y : x;
    y = x;
    x = z;
  }
  return x;
};
```