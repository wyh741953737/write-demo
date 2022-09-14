(function(window) {
    const PENDING = 'pending';
    const RESOLVED = 'resolved';
    const REJECTED = 'rejected';

    function Promise(excutor) {
        this.status = PENDING;
        this.data  = undefined;
        this.callbacks = [];
        const that = this;
        function resolve(value) {
            if(that.status !== PENDING) {
                return;
            }
            that.status = RESOLVED;
            that.data = value;
            if(that.callbacks.length > 0) {
                setTimeout(() => {
                    that.callbacks.forEach(callback => {
                        callback.onResolved(value);
                    })
                });
            }
        }
        function reject(error) {
            if(that.status !== PENDING) {
                return;
            }
            that.status = REJECTED;
            that.data = value;
            if(that.callbacks.length > 0) {
                setTimeout(() => {
                    that.callbacks.forEach(callback => {
                        callback.onRejected(error);
                    })
                });
            }
        }
        try {
            excutor(resolve, reject);
        } catch(error) {
            reject(error)
        }
    }

    Promise.resolve = function(value) {
        return new Promise((resolve, reject) => {
            if(value instanceof Promise) {
                value.then(resolve, reject);
            } else {
                resolve(value);
            }
        })
    }
    Promise.reject = function(reason) {
        return new Promise((resolve,reject) => {
            reject(reason)
        })
    }

    Promise.race = function(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach((p, index) => {
                Promise.resolve(p).then(
                    value => {
                        resolve(value);
                    },
                    reason => {
                        reject(reason)
                    }
                )
            })
        })
    }

    Promise.all = function(promises) {
        let values = new Array(promises.length);
        let count = 0;
        return new Promise((resolve, reject) => {
            promises.forEach((p, index) => {
                Promise.resolve(p).then(
                    value => {
                        count++;
                        values[index] = value;
                        if(promises.length === count) {
                            resolve(values);
                        }
                    },
                    reason => {
                        reject(reason)
                    }
                )
            })
        })
    }


    Promise.resolveDelay = function(value, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(value instanceof Promise) {
                    value.then(resolve, reject);
                } else {
                    resolve(value);
                }
            }, time);
        })
    }

    Promise.rejectDelay = function(reason, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(reason);
            }, time);
        })
    }

    Promise.prototype.then = function(onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};
        const that = this;
        return new Promise((resolve, reject) => {
            function handle(callback) {
                try {
                    const result = callback(that.data);
                    if(result instanceof Promise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch(error) {
                    reject(error);
                } 
            }
            if(that.status === PENDING) {
                that.callbacks.push({
                    onResolved(value) {
                        handle(onResolved)
                    },
                    onRejected(reason) {
                        handle(onRejected)
                    }
                })
            } else if(that.status === RESOLVED) {
                setTimeout(() => {
                    handle(onResolved) 
                });
            } else {
                setTimeout(() => {
                    handle(onRejected)
                });
            }
        })
    }

    Promise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    }
})(window);

    // 回调函数：同步回调：立即执行，完全执行完才结束，不会放入回调队列：数组遍历相关的回调/promise的executor函数
    //         异步回调：放入回调队列将来执行：定时器回调/ajax回调/promise的成功，失败回调

    // js的常见内置错误：
    //     ReferenceError： 引用错误，引用的变量不存在
    //     SyntaxError：语法错误
    //     TypeError：类型错误
    //     RangeError： 数据值不在其允许范围内 Maximum call stack size exceeded
    // 错误处理： throw new Error() 抛出异常， try...catch 捕获异常

    // promise的理解：
    // 1）从语法上来说，promise是一个构造函数(new Promise)，它不是一个新特性，而是一种新写法
    // 2）从功能上来说，promise是用了封装一个异步操作并可以获取返回值的方法。
    // promise是进行异步编程的新方案，

    // promise的状态一旦改变不能再变，只能从pending--》resolved，或者pending--》rejected

    // 为什么要用promise？
    // 1）指定回调函数的方式更加灵活，启动任务后=》给promise绑定回调函数（then里面的）
    // 2）纯回调函数方式，调用之前必须先指定成功或者失败的回调
    // 3）可以统一处理异常，便于找出错误

    // promise支持链式调用才可以解决回调地狱(嵌套，代码横向发展不便阅读，上一个函数执行得到的结果作为下一个函数的条件)，


    // promise
    // promiseAPI:
    // 1)executor函数： (resolve, reject) => {} 同步函数
    // 2)promise.resolve
    // 3)promise.reject
    // 4)promise.all，接收一个数组，数组成员是promise对象
    // 5)promise.delayResolve
    // 6) promise.prototype.then = (onResolved, onRejected) => {} 返回一个新的promise
    // 7) promise.prototype.catch = (reason) => {} 

    // promise指定多个成功/失败的回调，都会调用吗？
    // 都会调用，p.then(reason => ..reason1.), p.then(reason => .reason2..)

    // 改变状态和指定回调函数先后：
    // 都有可能，可以先指定回调函数，再改状态
    // const p = new Promise((resole, reject) => {
    //     setTimeOut(() => { resolve(2) }, 1000); 2秒之后改变状态
    // }).then(resolve....) 先指定回调函数，此时状态还没改，会先保存回调函数，

    // const p2 = new Promise((resolve,reject) => {
    //     resolve(3)
    // }).then(....) 先改状态后指定回调函数，回调函数不用保存

    // const p2 = new Promise((resolve,reject) => {
    //     resolve(3)
    // })
    // setTimeOut(() { p.then() }), 1000)

    // promise.then()返回的结果由什么决定?
    // promise得到的结果取决于上一个promise返回的结果
    //     1) 如果抛出异常，新promise变为rejected， reason为抛出的异常
    //     2）如果返回的是非promise的任意值，新promise变为resolved，value为返回的值
    //     3）如果返回的是另一个新的promise，次promise的结果将为新promise的结果

    // promise如何串联多个操作？
    // then链式调用，返回一个新的promise

    // promise异常穿透
    // 1）当使用promise的then链式调用时，可以在最后指定失败的回调，当前面任何操作出了异常都会传到最后失败的回调中处理，中间相当于调用了reason=> {throw reason}
    // 异常上面处理了就不会到catch
    // 中断promise链
    // 1）当使用promise的then链式调用时候，在中间中断，不在调用后面的回调函数
    // 2）办法：在回调函数中返回一个pending正泰的promise对象