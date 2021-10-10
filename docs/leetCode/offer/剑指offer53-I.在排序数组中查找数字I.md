---
sidebar: auto
---

## 描述
统计一个数字在排序数组中出现的次数。

## 示例1：
```
输入: nums = [5,7,7,8,10] target = 8
输出: 2
```

## 示例2：
```
输入: nums = [5,7,7,8,8,10], target = 6
输出：0
```

## 解题方案
思路：
> 排序数组中的搜索问题，首先想到 二分法 解决

排序数组nums中的所有数字target形成一个窗口，记窗口的 左/右 边界索引分别为 left 和 right，分别对应窗口左边/右边的首个元素。

本题要求统计数字 target 出现次数，可转换为：使用二分法分别找到左边界 left 和 右边界 right 易得数字target的数量为 `right-left+1`。

## 算法解析：
- 1 初始化 左边界 i = 0 右边界 j = len(nums)-1。
- 2 循环二分：当闭区间 [i,j] 没有元素的时候跳出循环
  - 1 计算中间节点 m = (i+j)/2 向下取整
  - 2 若 nums[m] < target 则 targettarget 在闭区间 [m + 1, j][m+1,j] 中，因此执行 i = m + 1i=m+1；
  - 3 若 nums[m] > targetnums[m]>target ，则 targettarget 在闭区间 [i, m - 1][i,m−1] 中，因此执行 j = m - 1j=m−1；
  - 4 若 nums[m] = targetnums[m]=target 则右边界 right 在闭区间 [m+1,j] 中，左边界left在闭区间[i,m-1] 中，因此分为以下两种情况：
    - 1 若查找 右边界 right，则执行 i = m+1 跳出时候 i 指向右边界
    - 2 若查找 左边界 left，则执行 j = m-1 跳出时候 j 指向左边界
- 3 返回值：应用两次二分，分别查找 right 和left 最终返回值 right-left-1 即可。

效率优化：
> 以下优化基于：查找完右边界 right = i 之后 则nums[j] 指向最右边的target （若存在）

- 1 查找完右边界之后，可用 nums[j] = i 判断数组中 是否包含 target 若不包含 则直接提前返回 0，无需后续查找左边界
- 2 查找完右边界后，左边界 leftleft 一定在闭区间 [0, j][0,j] 中，因此直接从此区间开始二分查找即可

[参考链接](https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/solution/mian-shi-ti-53-i-zai-pai-xu-shu-zu-zhong-cha-zha-5/)


```java
class Solution {
  public int search(int[] nums, int target) {
      // 搜索右边界 right
      int i = 0, j = nums.length - 1;
      while(i <= j) {
          int m = (i + j) / 2;
          if(nums[m] <= target) i = m + 1;
          else j = m - 1;
      }
      int right = i;
      // 若数组中无 target ，则提前返回
      if(j >= 0 && nums[j] != target) return 0;
      // 搜索左边界 right
      i = 0; j = nums.length - 1;
      while(i <= j) {
          int m = (i + j) / 2;
          if(nums[m] < target) i = m + 1;
          else j = m - 1;
      }
      int left = j;
      return right - left - 1;
  }
}
```

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  return getRightMargin(nums, target) - getRightMargin(nums, target - 1);
};

var getRightMargin = function(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while(left <= right) {
    let mid = parseInt((left + right) / 2);
    if(nums[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}
```
