let oldArrayPrototype = Array.prototype

export let newArrayPrototype = Object.create(oldArrayPrototype)
const arrMethods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
] // concat slice 都不会改变原数组

arrMethods.forEach(method => {
    newArrayPrototype[method] = function (...args) {
        const result = oldArrayPrototype[method].call(this, ...args)
        console.log('method',method)
        return result
    }
})
