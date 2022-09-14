const obj = {
  a: {
    b: 1,
    c: 2,
    d: { e:5}
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3
}

// 得到{ 'a.b': 1, 'a.c': 2, 'a.b.c': 5, 'b[0]' :1, 'b[1]': 3, 'b[2].a': 2, 'b[2].b': 3, 'c': 3 }

function isObj(val) {
  return typeof val === 'object' && val !== null
}
function flatten(obj) {
  if (!isObj(obj)) return;
  let res = {}
  const dfs = (cur, prefix) => {
    if (isObj(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((item, index) => {
          dfs(item, `${prefix}[${index}]`);
        })
      } else {
        for (let k in cur) {
          dfs(cur[k], `${prefix}${prefix ? '.' : ''}${k}`)
        }
      }
    } else {
      res[prefix] = cur;
   }
  }
  dfs(obj, '')
  return res
}


// 数组扁平化 arr.flat
const flatten = arr => {
  return arr.reduce((a,b) => {
    if(b instanceof Array) {
      return a.concat(flatten(b))
    }
    return a.concat(b)
  }, [])
}
// 统计字符串中每个字符出现的次数
const str = 'aaadddddvdcdsdcsd'
const arr = str.split('')
const strObj = arr.reduce((all, cur) => {
  if(cur in all) {
    all[cur]++
  } else {
    all[cur] = 1
  }
  return all
}, {})

// 按顺序调用promise，将上一个promise的值作为下一个promise的value处理
const p1 = a => {
  return new Promise(resolve => {
    resolve(a)
  })
}

const p2 = a => {
  return new Promise(resolve => {
    resolve(a*2)
  })
}
const p3 = a => {
  return new Promise(resolve => {
    resolve(a*3)
  })
}
const result = [p1, p2, p3].reduce((all, cur) => {
  return all.then(cur)
}, Promise.resolve(10))

result.then(res => {
  console.log(res)
})