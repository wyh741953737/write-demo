commonjs一般用在node里面
AMD： 也是一种js模块化规范，与commonjs最大的不同在于它采用异步的方式去加载依赖的模块，AMD规范是为了解决针对浏览器环境的模块化问题，requireJS是AMD模块化规范的实现。
    优点：可在不转换代码情况下直接在浏览器中运行，可加载多个依赖，代码可运行在浏览器环境和nodejs环境下
    缺点：js运行环境没有原生支持AMD，需要先导入实现了AMD的库后才能正常使用

ES6模块化：它在语言层面实现了模块化，它将逐渐取代commonJS和AMD规范，成为浏览器和服务器通用的模块化解决方案 
    缺点：无法直接运行在大部分js运行环境下，必须通过工具转换成标准的es5后才能正常运行

自动化构建：将源代码转换发布到线上，代码转换，文件优化（压缩），代码分割（提取多个页面公共代码，提取首屏不需要执行部分代码让其异步加载），模块合并，代码校验，自动发布

commonJS实现
function require(moduleName) {
    const content = fs.readFile(moduleName, 'utf8');
    let module = {
        exports: {}
    }
    const fn = new Function('exports','module', 'require','__dirname','__filename', content+'\n return module.exports');
    return fn(module.exports, module, require, __dirname, __dirname)
}
AMD规范实现：
let factories = {};
function define(moduleName, dependences, factory) {
    factories[moduleName] = factory;
    factories.dependences = dependences;
}
function require(modules, cb) {
    let result = modules.map(module => {
        let factory = factories[module];
        let exports;
        require(factories.dependences, function() {
            exports = factory.apply(null, arguments);
        })
        return exports;
    })
    cb.apply(null, result);
}