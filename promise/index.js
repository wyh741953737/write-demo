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



(function(w) {
    
    function Promise(excutor) {
        this.status  = 'pending';
        this.callbacks = [];
        this.value = undefined;
        const that = this;
        function resolve(value) {
            that.status = 'resolved';
            that.data =value;
            if(that.callbacks.length > 0) {
                that.callbacks.forEach(item => {
                    setTimeout(() => {
                        item.onResolved();   
                    });
                })
            }
        }
        function reject(reason) {
            that.status = 'rejected';
            that.data =reason;
            if(that.callbacks.length > 0) {
                that.callbacks.forEach(item => {
                    setTimeout(() => {
                        item.onRejected();   
                    });
                })
            }
        }
        excutor(resolve, reject)
    }


    Promise.all = function(promises) {
        return new Promise((resolve,reject)  => {
            let count  = 0;
            promises.forEach(p => {
                Promise.resolve(p).then(
                    value => {
                        if(count === promises.length) {
                            resolve(value)
                        } else  {
                            reject(value)
                        }
                    },
                    reason => {}
                )
            })
        })
    }
    Promise.prototype.then = function(onResolved, onRejected) {
        onResolved = typeof  onResolved  === 'function' ? onResolved : value => value
        const that = this;
        return new Promise((resolve, reject) => {
            function handler(callback) {
                const result =  callback(that.data);
                try {
                    if(result instanceof Promise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch(e) {
                    reject(e)
                }
            }
            if(that.status === 'pending') {
                that.callbacks.push({
                    onResolved(value) {
                        handler(onResolved)
                    },
                    onRejected(reason) {
                        handler(onRejected);
                    }
                })
            } else  if(that.status === 'resolved') {
                setTimeout(() => {
                    handler(onResolved)   
                });
            } else {
                setTimeout(() => {
                  handler(onRejected);   
                });
            }
        })
    }
})(window)