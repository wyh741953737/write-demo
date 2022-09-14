const tree = {
  tag: 'div',
  children: [
    {
      tag: 'div',
      children: [
        {
          tag: 'span',
          children: [
            {
              tag: 'a',
              children: []
            }
          ]
        }
      ]
    },
    {
      tag: 'div',
      children: []
    }
  ]
}

function render(vnode) {
  if(typeof vnode === 'number') {
    vnode = String(vnode);
  }
  if(typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }
  let dom = document.createElement(vnode.tag);
  if(vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key]
      dom.setAttribute(key, value)
    })
  }
  vnode.children.forEach(child => dom.appendChild(render(child)))
  console.log(dom)
  return dom
} 