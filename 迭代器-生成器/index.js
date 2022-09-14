// 迭代：计数循环就是一种最简单的迭代，循环是迭代机制的基础。因为她可以指定迭代的次数
// forEach无法标识迭代何时终止，此方法只适用于数组。
// 可迭代对象：实现了Iterable接口，可通过迭代器消费。数组或集合，包含的元素有限，并且都具有无歧义的遍历顺序。字符串，数组，映射，集合，arguments，DOM集合
// 


function *generator() {}

function co(generator) {
    let iterator = generator();
    let result;
    function next(args) {
        result = iterator.next(args)
        if(!result.done) {
            next(result.value);
        }
    }
    next(args)
}

co(generator)

class Event {

}