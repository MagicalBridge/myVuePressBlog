## 题目描述

输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

```
示例 1：
输入：target = 9
输出：[[2,3,4],[4,5]]
```

```
示例 2：
输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]
```

## 解题方案

最好的办法是使用滑动窗口，设立左右指针，从开始位置维护一个子数组作为窗口，判断这个窗口和是否是target，如果是则将结果加入，如果小于 target 则窗口右移，大于 target 则窗口左移。

## 算法流程
- 首先初始化窗口; left=1 right=2
- 当left小于right的时候始终维护这个窗口，只有当到达边界位置时候，窗口和sum > target left始终右移，才会结束窗口维护。
- 根据求和公式，sum=(left+right)∗(right−left+1)/2 （首项+末项） * 项数 / 2可以直接算出滑动窗口和。
- 当sum === target 的时候将窗口放入结果数组中。
- 当sum < target 的时候，说明窗口的结果需要变大，right ++
- sum > target 的时候，说明窗口结果需要变小，left++ （永远优势left++）

```js
/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
  // 初始化指针 这里为什么
  let left = 1;
  let right = 2;
  let res = [];

  while (left < right) {
    let sum = (left + right) * (right - left + 1) / 2;
    if (sum == target){
      // 维护子数组
      let arr = [];
      for (let k = left; k <= right; k++) {
        arr[k - left] = k;
      }
      res.push(arr);
      left++;
    }
    else if (sum < target) {
      right++;
    }
    else {
      left++;
    }
  }
  return res;
};
```
## 复杂度分析:
- 时间复杂度：O(n)
- 空间复杂度：O(n)