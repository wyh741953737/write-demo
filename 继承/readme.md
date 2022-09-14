1）原型链继承
function Person(name) {
    this.name = name';
    this.say = function() {
        alert(this.name);
    }
}

Person.prototype.age = 10;

function Son() {
    this.name = 'Eileen'
}

Son.prototype = new Person();
var son = new Son();
console.log(son.age) // 10

特定： 新的实例的原型等于父类的实例，实例可继承属性： 实例的构造函数的属性，父类的构造函数的属性，父类原型的属性，新的实例不会继承父类实例的属性
缺点： 新的实例无法向父类构造函数传参，继承单一，所有新实例都会共享父类实例属性

