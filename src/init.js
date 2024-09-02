export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        // 初始化数据
        initState(vm)
    }
}

// init state
function initState(vm) {
    const opt = vm.$options // 获取所有的选项
    if (opt.data) {
        initData(vm)
    }
}

function initData(vm) {
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data
    console.log('data', data);
}