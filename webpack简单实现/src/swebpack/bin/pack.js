#! /user/bin/env node
let entry = './src/index.js';
let output = './dist/main.js';
let fs = require('fs');
let script = fs.readFileSync(entry, 'utf8');

let ejs = require('ejs');

let template = `
((modules) => {
    function require(moduleId) {
        var module = {
            exports:{}
        }
        modules[moduleId].call(module.exports, module, module,exports, require);
        return module.exports;
    }
    return require("<%-entry%>");
})({
    '<%-script%>': (function(module, exports) {
        eval(\`<%-script%>\`);
    })
})
`
let result = ejs.render(template, {
    entry,
    script
})

fs.writeFileSync(output, result);
console.log('编译成功')

(() => { 
    var modules = ({
         "./src/a.js":((module) => {eval("module.exports = '迷糊'\n\n//# sourceURL=webpack://y/./src/a.js?");}),
         "./src/index.js": ((__unused_webpack_module, __unused_webpack_exports, require) => {
               eval("let str = require(/*! ./a */ \"./src/a.js\");\nconsole.log(str)\n\n//# sourceURL=webpack://y/./src/index.js?");
         })
    });
    var cache = {};
    function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
    		return cachedModule.exports;
    }
	var module = cache[moduleId] = {
    		exports: {}
    };
    modules[moduleId](module, module.exports, require);
            return module.exports;
    }
    var __webpack_exports__ = require("./src/index.js");
})();