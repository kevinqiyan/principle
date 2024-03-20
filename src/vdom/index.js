
// _c h 函数
export function createElementVNode(vm, tag, data, ...children) {
    if(!data) data = {}
    let key = data.key
    if (key) delete data.key
    return vnode(vm,tag,key,data,children)
}

// 文本: _v 函数
export function createTextVNode(vm, text) {
    return vnode(vm,undefined,undefined,undefined,undefined,text)
}

/**
 * 与 ast 一样吗？ -- 不一样
 * ast做的是语法层面的转化，他描述的是语法本身（可以描述 html、css、js）
 * 
 * 我们的虚拟dom 是描述的dom元素，可以增加一些自定义属性（描述dom，ps：自定义指令等）
 * **/ 

function vnode(vm, tag, key, data, children, text) {
    return {
        vm, tag, key, data, children, text
    }
}