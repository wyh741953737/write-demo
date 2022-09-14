function Parent(name, age) {
  this.name = name;
  this.age = age;
}

function ProtoChild(hobby) {
  this.hobby = hobby
}

// 原型继承 缺点：不支持子构造函数传参，原型上引用类型共享无法实现独立
ProtoChild.prototype = new Parent()
const child = new ProtoChild(['a'])

// 构造函数继承, 缺点：只是调用一些父构造函数，父构造函数原型没继承过来， 方法要在构造函数里面写，浪费内存
function ConstructChild(hobby, name, age) {
  Parent.call(this, name, age)
  this.hobby = hobby;
}

// 组合继承 缺点：父构造函数被调用2次
function CombineChild(bobby, name, age) {
  Parent.call(this, name, age)
  this.hobby = this.hobby
}
CombineChild.prototype = new Parent();

// 原型式继承
function create(o) {
  function F() { }
  F.prototype = o;
  return new F();
}
const proto = create(Parent)

// 寄生继承
function inhert(Child, Parent) {
  let prototype = create(Parent.prototype)
  prototype.Constructor = Child;
  Child.prototype = prototype;
}

inhert(ProtoChild, Parent)

// 或者更简单的

ProtoChild.prototype = Object.create(Parent.prototype)
ProtoChild.prototype.Constructor = ProtoChild;
