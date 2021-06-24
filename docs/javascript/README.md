---
sidebar: auto
---

# JavaScript

## 1、JavaScript中如何生成`n*n`的二维数组（矩阵）

```js
// 主要的思路是先生成一个一维数组.
const n = 4
const matrix = new Array(n).fill(0).map(() => new Array(n).fill(0))

console.log(matrix)

// 生成这样的形式
[ 
	[ 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0 ]
]
```
[call和apply的模拟实现](/javascript/call和apply的模拟实现.md)