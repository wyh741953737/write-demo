import React from 'react';
import ReactDOM from 'react-dom/client';


function before(beforeFn) {
  return function(target, methodName, descriptor) {
    let oldMethod = descriptor.value
    descriptor.value = function() {
      beforeFn.apply(this, arguments)
      return oldMethod.apply(this, arguments)
    }
  }
}
function after(afterFn) {
  return function(target, methodName, descriptor) {
    let oldMethod = descriptor.value
    descriptor.value = function() {
      afterFn.apply(this, arguments)
      return oldMethod.apply(this, arguments)
    }
  }
}
class App extends React.Component {
  @before(() => console.log('before'))
  onClickBefore () {
    console.log('onClickBefore')
  }
  @after(() => console.log('after'))
  onClickAfter () {
    console.log('onClickAfter')
  }
  @after(() => fetch('/api/report'))
  ajaxClick () {

  }

  register (event) {

  }
  // AOP面向切片编程
  // register.prototype.before = function (beforeFn) {
  //   let that = this
  //   return function () {
  //     let passs = beforeFn()
  //     if(pass) {
  //       that.apply(this, arguments)
  //     }
  //   }
  // }
  // register = register.before(function() {
  //   let uerName = document.getElementById('name')
  //   if(!uerName) {
  //     return alert('用户名不能为空')
  //   }
  //   return true
  // })
  render() {
    return (
      <div>
        <button onClick={this.onClickBefore}>beforeClick</button>
        <button onClick={this.onClickAfter}>afterClick</button>
        <button onClick={this.ajaxClick}>ajaxClick</button>
        <input id="name" type="text"></input>
        <button onClick={this.register}>注册</button>
      </div>
    )
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

