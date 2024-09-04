
import { newArray } from './array'
class Observe {
    constructor(data) {

        // data.__ob__ = this // 这样写会 爆栈
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            data.__proto__ = newArray
            this.arrayWalk(data)
        } else {
            this.walk(data)
        }
    }
    // 对象方法劫持
    walk(data) {
        // 这里进行踩坑了
        Object.keys(data).forEach(key => defineProxy(data, key, data[key]));
    }
    // 数组劫持
    arrayWalk(data) {
        data.forEach(it => initObserve(it))
    }
}

export function initObserve(data) {
    if (typeof data !== 'object' || data === null) return
    if (data.__ob__ instanceof Observe) return
    return new Observe(data)
}


export function defineProxy(target, key, value) {
    // 如果value是对象，则采用递归的形式进行数据劫持
    initObserve(value)
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return
            // 为了防止赋值时数据是一个对象，对对象进行数据劫持
            initObserve(value)
            value = newValue
        }
    })
}

