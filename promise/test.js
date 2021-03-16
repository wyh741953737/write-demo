(function(window) {
    function Promise(excutor) {
        this.status = 'pending';
        this.data = undefined;
        this.callBacks = [];

        function resolve(value) {
            // 1.改状态， 2.保存value， 3.如果有待执行回调函数（先指定回调，再改状态就会有待执行的回调函数），立即异步执行回调
            if(this.status !== 'pending') {
                return
            } 
            this.status = 'resolved';
            this.data = value;
            if(this.callBacks.length > 0) {
                setTimeout(() => {
                    this.callBacks.forEach(callBacksObj => {
                        callBacksObj.onResolved(value);
                    });   
                });
            }

        }
        function reject(reason) {
            this.status = 'rejected';
            this.data = reason;
            if(this.callBacks.length > 0) {
                setTimeout(() => {
                 this.callBacks.forEach(callBacksObj => {
                     callBacksObj.onRejected(reason)
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

    Promise.prototype.then = function(onResolved, onRejected) {
        this.callBacks.push({
            onResolved,
            onRejected
        })
    }
    Promise.prototype.catch = function(onRejected) {

    }
    Promise.resolve = function(value) {

    }
    Promise.reject = function(reason) {

    }
    Promise.all = function(promises) {

    }
    Promise.race = function(promises) {

    }
    window.Promise = Promise;
})(window)