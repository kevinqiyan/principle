import { initState } from './state';
import { compileToFunction } from './compile/index'
import { mountComponent } from './lifecycle'

// 给 Vue 增加init 方法
export function initMixin(Vue) {

    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        initState(vm)
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el) // document.querySelector 返回匹配指定选择器的第一个元素
        let opt = vm.$options
        
        if (!opt.render) { // 先进行查找有没有render函数
            let template; // 没有render查验是否写了template
            if (!opt.template && el) { // 没有template
                template = el.outerHTML
            } else {
                if (el) {
                    template = opt.template
                }
            }

            if (template && el) {
                const render = compileToFunction(template)
                opt.render = render
            }

        }
        mountComponent(vm,el)
    }
}

