const factorial = function (num) {
  if (num === 1) {
    return 1;
  } else {
    return (num * factorial(num-1))
  }
}

const proxyCache = function (fn) {
  const cache = {};
  return function (num) {
    if (num in cache) {
      return cache[num];
    }
    return cache[num] = fn.call(this, num)
  }
}
const proxyFactorial = proxyCache(factorial);
proxyFactorial(5) // 直接使用factorial会执行25次，缓存代理后只会执行5次
proxyFactorial(5)
proxyFactorial(5)
proxyFactorial(5)
proxyFactorial(5)

