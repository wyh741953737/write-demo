const map = new Map();
const wMap = new WeakMap();
(function test() {
    const k1 = {x: 1};
    const k2 = {y: 2};
    map.set(k1, 'k1');
    wMap.set(k2, 'k2')
})()
map.forEach((key, value) => console.log(key, value))
// 思考一个问题：运行完test函数后，我们是否还要保留map里的k1呢？当然是不要的。
// 但是运行forEach方法，发现map里面的k1依然能指向{x:1}，而且除了调用clear方法，我们无法删除这个对象，垃圾回收器更无法对它回收，久而久之就内存溢出了
// Map共用了两个数组（一个放key,一个放value）。
// 给Map set值时会同时将key和value添加到这两个数组的末尾。从而使得key和value的索引在两个数组中相对应。
// 当从Map取值时，需要遍历所有的key，然后用索引从存储值的数组中检索出相应的value。
// 这个实现的缺点很大，首先是赋值和搜索的时间复杂度为O(n)；其次是可能导致内存溢出，
// 因为数组会一直保存每个键值引用，即便是引用早已离开作用域，垃圾回收器也无法回收这些内存。

let WeakMap = function() {
    this.name = '__wm__' + uuid()
};
WeakMap.prototype = {
    set: function(key, value) {
        Object.defineProperty(key, this.name, {
            value: [key, value],
        });
        return this;
    },
    get: function(key) {
        var entry = key[this.name];
        return entry && (entry[0] === key ? entry[1] : undefined);
    },
};
// WeakMap并没有使用任何数组。weakmap.set(key, val)事实上是直接通过Object.defineProperty给这个key加了一个新属性——this.name，
// 这就解释了为什么WeakMap的key必需是个Object了；
// 同理，weakmap.get(key)是从key的该属性里获取了值对象。相比Map，WeakMap持有的只是每个键值对的“弱引用”，
// 不会额外开内存保存键值引用。这意味着在没有其他引用存在时，垃圾回收器能正确处理key指向的内存块。
// 正因为这个特殊的实现，WeakMap的key是不可枚举的，更不用说提供keys()、forEach()这类方法了。




