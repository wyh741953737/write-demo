// 科里化：将大范围变小范围，接收部分参数延迟执行，返回接收剩余参数的函数，参数复用，延迟执行，用到了arguments，闭包，递归，用多了性能不好

function curring(fn, params = []) {
    const len = fn.length;
    return function(...args) {
        const arr = [...params, ...args];
        if(arr.length < len) {
            return curring(fn, arr);
        } else {
            return fn(...arr);
        }
    }
}
function isType(type) {
    return function(value) {
        return Object.prototype.toString.call(value) === `[object ${type}]`;
    }
}
const isArray = curring(isType)('Array');
console.log(isArray([1,2,3]))









