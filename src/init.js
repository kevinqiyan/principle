import { initState } from './state'
// test
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        // 初始化数据
        initState(vm)
    }
}
