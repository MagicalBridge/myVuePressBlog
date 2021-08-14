/**
 * lru design
 * @param operators int整型二维数组 the ops
 * @param k int整型 the k
 * @return int整型一维数组
 */
function LRU(operators, k) {
  let map = new Map()
  let list = [] // 用来维护缓存队列
  let res = [] // 存放每次取值时候的操作返回值

  for (var item in operators) {
    var op = operators[item][0] // 取值还是存值的操作标识
    if (op === 1) {
      // 说明是存值操作
      map.set(operators[item][1], operators[item][2])
      if (list.length >= k) {
        // 存值操作的时候需要判断当前的这个缓存队列是否已经满了
        list.shift()
      }
      list.push(operators[item][1])
    } else if (op === 2) {
      // 取值操作
      let key = operators[item][1]
      let index = list.indexOf(key)
      if (index == -1) {
        res.push(-1)
      } else {
        res.push(map.get(key))
        list.splice(index, 1)
        list.push(key)
      }
    }
  }
  console.log(res)
  return res
}

var operators = [
  [1, 1, 1],
  [1, 2, 2],
  [1, 3, 2],
  [2, 1],
  [1, 4, 4],
  [2, 2],
]

LRU(operators, 3)
