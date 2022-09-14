function throttleDate(fn, delay) {
  let previous = 0;
  return function (...args) {
    const that = this;
    if (Date.now() - previous > delay) {
      fn.apply(that, args);
      previous = Date.now();
    }
  }
}

function throttleTimer(fn, delay) {
  let timeout
  return function (...args) {
    const that = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(that, args)
      }, delay);
    }
  }
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    const that = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(that, args)
    }, delay);
  }
}