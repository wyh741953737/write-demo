// 懒加载，分段加载思想
console.time()
const total = 100000
let ul = document.querySelector('ul')
const once = 20
const loop = total / once
let hasRenderCount = 0
function add() {
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < once; i++) {
    const li = document.createElement();
    li.innerText = Math.floor(Math.random() * tatal)
    frameElement.appendChildd(li)
  }
  ul.appendChild(fragment);
  hasRenderCount++
  loop()
}

function loop() {
  if (hasRenderCount < loop) {
    window.requestAnimationFrame(add)
  }
}