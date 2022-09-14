// 咖啡
class Coffee {
  make(water) {
    return `${water}+咖啡`
  }
  cost () {
    return 10
  }
}
// 加奶的咖啡
class MikeCoffee{
  constructor(parent) {
    this.parent = parent
  }
  make(water) {
    return `${this.parent.make(water)}+奶`
  }
  cost () {
    return this.parent.cost()+3
  }
}
// 加糖的咖啡
class SugarCoffee{
  constructor(parent) {
    this.parent = parent
  }
  make(water) {
    return `${this.parent.make(water)}+糖`
  }
  cost () {
    return this.parent.cost()+2
  }
}
// 
let coffee = new Coffee() // 实例化一个咖啡
let milkCoffee = new MikeCoffee(coffee) // 把咖啡放进去，生成一个加了牛奶的咖啡
const res = milkCoffee.make('水') // 加水的咖啡
console.log(res)
let sugarCoffee = new SugarCoffee(coffee)
const res2 = sugarCoffee.make('水')
console.log(res2)
console.log(milkCoffee.cost())
console.log(sugarCoffee.cost())