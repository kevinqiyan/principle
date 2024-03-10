import { newArrayPrototype } from "./array"

class Observe {
    constructor(data) {
        if (Array.isArray(data)) {
            // 这里踩坑了，应该是两个下划线 __
            data.__proto__ = newArrayPrototype
            // this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    // 对象劫持方法
    walk(data) {
        // 重新定义对象
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    // 数组劫持方法
    observeArray(data) {
        data.forEach(item => observe(item))
    }

}

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return
    }
    return new Observe(data)
}

export function defineReactive(target, key, value) { // 闭包
    // 如果value是对象，则采用递归的形式进行数据劫持
    observe(value)
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return
            // 为了防止赋值时数据是一个对象，对对象进行数据劫持
            observe(value)
            value = newValue
        }
    })
}

