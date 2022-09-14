class EventEmit {
  constructor() {
    this.events = {}
  }
  // 订阅
  on(type, callback) {
    if (!this.events[type]) {
      this.events[type] = callback
    } else {
      this.events[type].push(callback)
    }
  }
  // 取消订阅
  off(type, callback) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter(item => item !== callback);
  }
  // 只执行一次订阅
  once(type, callback) {
    function fn() {
      callback();
      this.off(type, fn)
    }
    this.on(type, fn)
  }
  // 触发事件
  emit(type, ...rest) {
    this.events[type] &&
      this.events[type].forEach(fn => fn.apply(this, rest))
  }
}

const events = new EventEmit();
const handler = (...rest) => {
  console.log(rest)
}

const doubleClick = () => {
  console.log('dbCliick')
}

events.on('click', handler)

events.emit('click', 1, 2, 3, 4)

events.off('click', handler)

events.once('dbClick',doubleClick)
events.emit('dbClick')