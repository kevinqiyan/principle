

class Observe {
    constructor(data) {
        walk(data)
    }
    // 对象方法劫持
    walk(data) {
        Object.keys(data).forEach(element => defineProxy(element));
    }
}

function initObserve(data) {
    if (typeof data !== 'object' || data === null) return
    return new Observe(data)
}


function defineProxy(target, key, value) {

    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return
            initObserve(value)
            value = newValue
        }
    })
}

