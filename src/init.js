// 给 Vue 增加init 方法
export function initMixin(Vue) {

    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        debugger
        initState(vm)
    }
}
function initState(vm) {
    const opts = vm.$options

    if (opts.data) {
        initData(vm)
    }
    
}

function initData(vm) {

    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data

    console.log('data', data);
}