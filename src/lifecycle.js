import { createElementVNode, createTextVNode } from "./vdom/index";



function createElm(vnode){
    let {tag,data,children,text} = vnode;
    if(typeof tag === 'string'){ // 标签
        vnode.el =  document.createElement(tag); // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了
        patchProps(vnode.el,data);
        children.forEach(child => {
            vnode.el.appendChild( createElm(child))
        });
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
function patchProps(el,props){
    for(let key in props){
        if(key === 'style'){ // style{color:'red'}
            for(let styleName in props.style){
                el.style[styleName] = props.style[styleName];
            }
        }else{
            el.setAttribute(key,props[key]);
        }
    }
}

// patch 既有初始化的功能，又有更新操作
function patch(oldVNode,vnode) {
    // 编写的是初渲染流程
    const isRealElement = oldVNode.nodeType
    if (isRealElement) {
        const elm = oldVNode // 获取真实元素
        const parentElm = elm.parentNode // 获取父元素
        let newElm =  createElm(vnode);

        parentElm.insertBefore(newElm,elm.nextSibling);
        parentElm.removeChild(elm); // 删除老节点

        return newElm
    } else {
        // diff 算法
    }
}


export function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) { // 讲虚拟dom转换为真实dom
        const vm = this
        const el = vm.$el
        console.log('_update', vnode, '\n', el);
        vm.$el =  patch(el,vnode)
    }
    Vue.prototype._render = function () {
        console.log('_render');
    }

    // _c('div',{},...children) dom
    Vue.prototype._c = function () { 
        return createElementVNode(this,...arguments)
    }
    
    // _v(text) 文本
    Vue.prototype._v = function () { 
        return createTextVNode(this,...arguments)
    }
    
    // _s
    Vue.prototype._s = function (value) {
        // 不是对象时就返回 value 本身，否则会被 JSON.stringify 后数据有问题（ps：text: "\"kevin\"hello"）
        if(typeof value !== 'object') return value
        return JSON.stringify(value)
    }

    // render 函数
    Vue.prototype._render = function () {
        // 当渲染的时候回去实例中取值，我们就可以将属性和视图绑定在一起
        return this.$options.render.call(this) // 通过 ast 语法转译后生成 render 函数
    }
}



export function mountComponent(vm,el){ // 这里的el 是通过 querySelector 处理过的
    vm.$el = el;

    // 1.调用render方法产生虚拟节点 虚拟DOM
    vm._update(vm._render()); // vm.$options.render() 虚拟节点

    // 2.根据虚拟DOM产生真实DOM 

    // 3.插入到el元素中

}
// vue核心流程 1） 创造了响应式数据  2） 模板转换成ast语法树  
// 3) 将ast语法树转换了render函数 4) 后续每次数据更新可以只执行render函数 (无需再次执行ast转化的过程)
// render函数会去产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM