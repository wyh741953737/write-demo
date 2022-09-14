(function () {
  function Promise(excutor) {
    this.status = 'pending'
    this.callbacks = [];
    this.data = undefined;
    const that = this;

    function resolve(value) {
      if (that.status !== 'pending') return;
        that.status = 'resolved';
        this.data = value;
        if (that.callbacks.length > 0) {
          that.callbacks.forEach(cb => {
            setTimeout(() => {
              cb.onResolve(value)
            });
          })
        }
      }
    function reject(reason) {
      if (that.status !== 'pending') return
        that.status = 'rejected';
        this.data = value;
        if (that.callbacks.length > 0) {
          that.callbacks.forEach(cb => {
            setTimeout(() => {
              cb.onReject(reason)
            });
          })
        }
    }
    try {
      excutor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
          value.then(v => resolve(v))
      } else {
        resolve(value)
      } 
    })
  }
  Promise.all = function (promies) {
    let count = 0;
    let data = newArray(promies.length)
    return new Promise((resolve, reject) => {
      promies.forEach((promise, index) => {
        Promise.resolve(promise).then(
          value => {
            count++;
            data[index] = value
            if (count === promies.length) {
              resolve(data)
            }
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }
  promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(p => {
        Promise.resolve(p).then(resolve, reject)
      })
    })
  }

  promies.prototype.then = function (onResolve, onReject) {
    onResolve = typeof onResolve === 'function' ? onResolve : v => v;
    onReject = typeof onReject === 'function' ? onReject : r => { throw Error };
    const that = this
    return new Promise((resolve, reject) => {
      function handler(cb) {
        const value = cb(that.data);
        try {
          if (value instanceof Promise) {
            value.then((v) => {
               resolve(v)
            })
          } else {
             resolve(value)
          }
        } catch (e) {
          reject(e)
        }
      }

      if (that.status === 'pending') {
        that.callbacks.push({
          onResolve() { handler(onResolve) },
          onReject() { handler(onReject) }
        })
      } else if (that.status === 'resolved') {
        setTimeout(() => {
          handler(onResolve)  
        });
      } else {
        setTimeout(() => {
          handler(onReject)  
        });
      }
    })
  }
})(window)