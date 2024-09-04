import { initState } from './state'
// test
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        // 初始化数据
        initState(vm)
        if (options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el)
        let ops = vm.$options
        if (!ops.render) { // 先查看有没有render函数
            let template
            if (!ops.template && el) {
                template = el.outerHTML
            } else {
                if (el) template = ops.template
            }
            console.log('template', template);
        }

    }

}


