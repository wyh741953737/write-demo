const { resolve } = require("node:path");

const { reject } = require("core-js/fn/promise")

(function(window) {
    function Promise(excutor) {
        this.status = 'pending';
        this.data = undefined;
        this.callbacks = [];
        const that = this
        function resolve(value) {
            that.status = 'resolved';
            that.data = value;
            if(that.callbacks.length > 0) {
                that.callbacks.forEach(callobj => {
                    setTimeout(() => {
                     callobj.onResolved();
                    });
                })
            }
        }

        function reject(error) {
            that.status = 'rejected';
            that.data = error;
            if(that.callbacks.length > 0) {
                that.callbacks.forEach(callobj => {
                    setTimeout(() => {
                     callobj.onRejected();
                    });
                })
            }
        }
        try {
            excutor(resolve, reject)
        }catch(error) {
            reject(error)
        }
    }

    Promise.resolve = function(value) {
        return new Promise((resolve, reject) => {
            if(value instanceof Promise) {
                value.then(resolve, reject)
            } else {
                resolve(value);
            }
        })
    }

    Promise.reject = function(err) {
        return new Promise((resolve, reject) => {
            reject(err)
        })
    }

    Promise.race = function(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(p => {
                Promise.resolve(p).then(resolve, reject)
            })
        })
    }
    Promise.all = function(promises) {
        const values = new Array(promises.length);
        let count = 0;
        return new Promise((resolve, reject) => {
            promises.forEach((p, index) => {
                Promise.resolve(p).then(
                    value  => {
                        count++;
                        values[index] = value;
                        if(count === promises.length) {
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
    Promise.prototype.then = function(onResolved, onRejected) {
        const onResolved = typeof onResolved === 'function' ? onResolved : value => value;
        const onRejected = typeof onRejected === 'function' ? onRejected : reason => reason;
        const that  = this;
        return new Promise((resolve, reject) => {
            const handler = function(callback) {
                const result = callback(that.data);
                try {
                    if(result instanceof Promise) {
                        result.then(resolve, reject)
                    } else  {
                        resolve(result)
                    }
                } catch(err) {
                    reject(err)
                }
            }
            if(that.status === 'pending') {
                that.callbacks.push({
                    onResolved(value) {
                        handle(onResolved)
                    },
                    onRejected(reason) {
                        handle(onRejected)
                    },
                })
            } else  if(that.status === 'resolved') {
                setTimeout(() => {
                    handler(onResolved)   
                });
            } else {
                setTimeout(() => {
                    handler(onRejected)   
                });
            }
        })
    }
})(window)