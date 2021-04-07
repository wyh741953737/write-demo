const fs = require('fs');

function require(fileName) {
    const content  = fs.readFile(fileName, 'utf8');
    const fn = new Function('exports', 'module', 'require', '__dirname', '__filename', content+'\n return module.exports');
    let module = {
        exports: {}
    }
    return fn(module.exports, module, require, __dirname, __dirname)
}
const str = require('./a');
console.log(str)