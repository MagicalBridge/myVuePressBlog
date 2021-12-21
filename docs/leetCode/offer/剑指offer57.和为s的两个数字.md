## 剑指offer57.和为s的两个数字

## 题目描述
输入一个递增排序的数组和一个数字s,在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。

示例 1：
```
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]
```

示例 2：
```
输入：nums = [10,26,30,31,47,60], target = 40
输出：[10,30] 或者 [30,10]
```

## 解题方案：
思路：
- 标签：双指针
- 整体思路：因为数组本身是有序的，那么完全可以在数组的开头 start 和结尾 end 位置各设置一个指针，通过二者的加和和sum来找到target，如果 sum < target，则 start++，这样可以让下一次的 sum 变大，如果 sum > target，则 end--，这样可以让下一次的 sum 变小，找到结果
- 时间复杂度：O(n)，空间复杂度：O(1)

算法流程：
- 1 首先初始化 start = 0，end = nums.length - 1，作为双指针
- 2 当 start < end 时，始终进行循环遍历
- 3 计算 sum = nums[start] + nums[end]，并将 sum 与 target 进行比较
- 4 如果 sum < target，则需要将下一次的 sum 值变大，因为数组有序，故而 start++
- 5 如果 sum > target，则需要将下一次的 sum 值变小，因为数组有序，故而 end--
- 6 如果 sum == target，则找到了最终的结果，将结果返回即可

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let start = 0;
  let end = nums.length - 1;
  while(start < end) {
    const sum = nums[start] + nums[end];
    if(sum < target) {
      start++;
    } else if(sum > target) {
      end--;
    } else {
      return [nums[start], nums[end]];
    }
  }
  return [];
};
```

