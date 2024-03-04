import { observe } from "./obsever/index"


function initState(vm) {
    const opts = vm.$options

    if (opts.data) {
        initData(vm)
    }
    
}

function initData(vm) {

    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data
    vm._data_ = data
    observe(data)
    for (const key in data) {
        proxy(vm,'_data_',key)
    }
}

function proxy(vm,target,key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}

export {
    initState
}