function createElement(type, props, childrend) {
    return new Element(type, props, childrend);
}
class Element {
    constructor(type, props, childrend) {
        this.type = type;
        this.props = props;
        this.childrend = childrend;
    }
}

function render(eleObj) {
    const el = document.createElement(eleObj.type);
    for(let key in eleObj.props) {
        setAttr(el, key, eleObj.props[key]);
    }
    eleObj.childrend.forEach(child => {
        child = child instanceof Element ? render(child) : document.createTextNode(child);
        el.appendChild(child);
    })
}

function setAttr(node, key, value) {
    switch(key) {
        case 'value': {
            if(node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        }
        case 'style': {
            node.style.cssText = value;
            break;
        }
        default: {
            node.setAttribute(key, value);
            break;
        }
    }
}
const vituralDom1 = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['a']),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['c']),
])
const vituralDom2 = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['a']),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['d']),
])

let Index = 0;
function diff(oldTree, newTree) {
    let patches = {};
    let index = 0;
    walk(oldTree, newTree, index, patches);
    return patches;
}

function walk(oldTree, newTree, index, patches) {
    let currentPath = [];
    if(!newTree) {
        currentPath.push({type: 'REMOVE', index})
    }
    if(isString(oldTree) && isString(newTree)) {
        if(oldTree !== newTree) {
            currentPath.push({type: 'TEXT', text: newTree});
        }
    } else if(oldTree.type === newTree.type) { // 如果类型相同
        let attrs = diffAttrs(oldTree.props, newTree.props); // 属性补丁包
        if(Object.keys(attrs).length) {
            currentPath.push({type: 'ATTRS', attrs});
        }
        diffChildren(oldTree.children, newTree.children, index, patches);
    } else { // 类型都不相同，直接替换
        currentPath.push({type: 'REPLACE', newTree});
    }
    if(currentPath.length) {
        patches[index] = currentPath;
    }
}

function diffAttrs(oldAttrs, newAttrs) {
    let patch = {}
    for(let key in oldAttrs) {
        if(oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key]
        }
    }
    for(let key in newAttrs) {
        if(!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}

function diffChildren(oldChildren, newChildren, index,patches) {
    oldChildren.forEach((child, idx) => {
        walk(child, newChildren[idx], ++Index, patches);
    })
}

function isString(node) {
    return Object.prototype.toString.call(node) === '[object String]'
}

function patch(node, patches) {
    
}