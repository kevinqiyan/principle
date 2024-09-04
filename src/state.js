// init state
import { initObserve } from "./observe/index"

export function initState(vm) {
    const opt = vm.$options // 获取所有的选项
    if (opt.data) {
        initData(vm)
    }
}

function initData(vm) {
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data
    vm._data_ = data
    console.log('初始化数据', data);
    initObserve(data)
    for (const key in data) {
        proxy(vm, '_data_', key)
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}
