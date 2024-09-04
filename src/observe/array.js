let oldArray = Array.prototype

export let newArray = Object.create(oldArray)

// 数组方法：可以更改原数组的
const arrMethods = [
    "push",
    "unshift",
    "shift",
    "pop",
    "sort",
    "reserve",
    "splice"
]
// 重写数组方法
arrMethods.forEach(it => {
    newArray[it] = function (...args) {
        const result = oldArray[it].call(this, ...args)
        let init
        switch (it) {
            case 'push':
            case 'unshift':
                init = args
                break;
            case 'splice': // arr.splice(0,1,{a:1}) --> 新增一条数据
                init = args.slice(2) // 取 {a:1}
                break;
            default:
                break;
        }
        console.log('init', init);
        ob.arrayWalk(init)
        return init
        // return result
    }
})