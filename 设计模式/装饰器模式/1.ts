// 装饰类
namespace a {
  interface Animal {
    swings: number;
    fly: Function
  }
  function flyable(target) {
    target.prototype.swings = 2
    target.prototype.fly = function() {
      console.log('我能飞')
    }
  }
  @flyable // 装饰器装饰Animal，target是类的构造函数本身
  class Animal {
    constructor() {}
  }
  let animal: Animal = new Animal()
  console.log(animal.swings)
  animal.fly()
}

// 装饰器工厂函数
namespace b {
  interface Animal {
    swings: number;
    fly: Function
  }
  function flyable(swings) {
    return function flyable(target) {
      target.prototype.swings = swings
      target.prototype.fly = function() {
        console.log('我能飞')
      }
    }
  }
  @flyable(2) // 装饰器装饰Animal，工厂函数
  class Animal {
    constructor() {}
  }
  let animal: Animal = new Animal()
  console.log(animal.swings)
  animal.fly()
}

// 装饰方法
namespace c {
  // 实例属性时，target是类的原型对象，key是属性的名字
  function instancePropertyDecorator(target, key) {
    target.protoName = '我是类原型上的属性'
  }
  // 实例的方法时，target是类的原型，key方法名 descriptor属性描述符
  function instanceMethodDecorator(target, key, descriptor) {
    console.log('instanceMethodDecorator', target, key)
  }
  // 类的静态属性时，target是类的构造函数，key是属性名
  function classPropertyDecorator(target, key) {
    console.log('classPropertyDecorator', target, key)
  }
  // 类的静态方法时，target是类的构造函数，key方法名 descriptor属性描述符
  function classMethodDecorator(target, key, descriptor) {
    console.log('classMethodDecorator', target, key)
  }
  class Person {
    @instancePropertyDecorator
    instanceProperty: string; // 实例属性
    @classPropertyDecorator
    static classProperty: string; // 类的静态属性
    @instanceMethodDecorator
    instanceMethod() {} // 实例方法
    @classMethodDecorator
    static classMethod() {} // 类的静态方法
  }
}