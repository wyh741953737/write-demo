Function.prototype.myBind = function(thisArg) {
  if(typeof this !== "function") {
      throw new Error("不是一个函数")
  }
  const self = this // 保存this，也就是调用bind的人
  const args = [...arguments].slice(1) // 获取参数
  const construct = function() { // 创建一个函数
      // console.log('this',this) this一开始指向window，之后指向fnBound{}
      const _this = this instanceof self ? this : thisArg; // 判断
      return self.apply(_this, args.concat(Array.prototype.slice.apply(arguments)))
  }
  function fnFun() {}
  fnFun.prototype = self.prototype;
  construct.prototype = new fnFun();
  return construct; // 返回一个函数
}


function myThis() {
  const obj = new Object();
  obj.__proto__ = Constructor.prototype
  const result = Constructor.apply(obj, [...arguments])
  return  typeof result === 'object' ? result : obj 
}