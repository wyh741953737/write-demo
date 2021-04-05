#! /user/bin/env node
let entry = './src/index.js';
let output = './dist/main.js';
let fs = require('fs');
let script = fs.readFileSync(entry, 'utf8');

let ejs = require('ejs');

let template = `
(function(modules) {
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