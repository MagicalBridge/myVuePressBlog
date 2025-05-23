# 剑指offer04.二维数组中的查找

## 题目描述：
在一个 n * m 的二维数组中，每一行都按照从**左到右递增**的顺序排序，每一列都按照**从上到下递增**的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

示例:

现有矩阵 **matrix** 如下:

```
[
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```

给定 target = 5，返回 true。
给定 target = 20，返回 false。

限制：
`0 <= n <= 1000`
`0 <= m <= 1000`

思路:
- 标签：数组遍历
- 从矩阵的左下角看，上方的数字都比其小，右方的数字都比其大，所以依据这个规律去判断数字是否存在
- 设置当前数字为`cur`, 目标数字是`target`,当 `target < cur` 时候, `cur` 更新为其上面的数字，当 `target > cur` 时候，`cur`更新为其右边的数字 直到相等则返回`true`，否则到了矩阵的边界返回`false`
- 时间复杂度：O(m+n)

这道题目对于我来说，不太好想的地方就是从最左边的位置开始遍历，而且在找到最左边的这个点的坐标也是耗费了比较长的一段时间。
从题目给出的这个例子可以看出18就是最左下角的点，那这个位置如何确定呢？

这里其实可以建立一个直角坐标系，这个坐标系是比较反直觉的，以 1 这个数字为坐标原点，y 轴向下延伸，x 轴向右延伸。这样就能确定每一个元素的位置了。


```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
  // 首先进行判空处理 如果矩阵本身就是空的 不会有目标值，直接返回false
  if (matrix.length == 0) {
    return false
  }
  // 设置左下角第一个元素的坐标
  let x = 0; 
  let y = matrix.length - 1;
  // 这里使用while循环，循环条件是不要越界
  // x 向右递增，且 坐标从0开始 最右边的数是 matrix[0].length-1
  // y 从下往上移动 逐渐递减 不要小于0。
  while (x < matrix[0].length && y >= 0) {
    // 当前走到的元素 大于目标值，向上移动 缩小范围
    if(matrix[y][x] > target) {
      y--;
    } else if(matrix[y][x] < target) { // 小于向右移动
      x++;
    } else { // 否则就是目标元素
      return true;
    }
  }
  // 遍历完成之后没有找到直接返回 false
  return false;
};
```

```go
func findNumberIn2DArray(matrix [][]int, target int) bool {
    if len(matrix) == 0 {
        return false
    }
    x := 0
    y := len(matrix) - 1
    for x < len(matrix[0]) && y >= 0 {
        if matrix[y][x] > target {
            y--
        } else if matrix[y][x] < target {
            x++
        } else {
            return true 
        }
    }
    return false
}
```

复杂度分析：
- 时间复杂度：O(n+m)。
  时间复杂度分析的关键是注意到在每次迭代（我们不返回 true）时，行或列都会精确地递减/递增一次。由于行只能减少 m 次，而列只能增加 n 次，因此在导致 while 循环终止之前，循环不能运行超过 n+m 次。因为所有其他的工作都是常数，所以总的时间复杂度在矩阵维数之和中是线性的。
- 空间复杂度：O(1)，因为这种方法只处理几个指针，所以它的内存占用是恒定的。

- 1207 今天在复习这道题目的时候，脑海中冒出的第一个念头是，倒着来，就是把坐标系
