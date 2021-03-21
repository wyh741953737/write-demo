function *generator() {}

function co(generator) {
    let iterator = generator();
    let result;
    function next(args) {
        result = iterator.next(args)
        if(!result.done) {
            next(result.value);
        }
    }
    next(args)
}

co(generator)