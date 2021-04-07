define('name', ['age', 'address'], function() {
    return `我是${age}amd的define`
});
define('age', [], function() {
    return 26
});

require(['name', 'age'], function(name, age) {
    console.log(name, age);
})

let factories = {};
function define(moduleName, depends, factory) {
    factory.dependences = depends; 
    factories[moduleName] = factory;
}

function require(modules, callback) {
    let result = modules.map(module => {
        let exports;
        let dependences = factories.dependences;
        let factory = factories[module];
        require(dependences, function() {
            exports = factory.apply(null, arguments)
        })
        return exports;
    })
    callback.apply(null, result);
}