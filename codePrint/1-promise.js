const promise = new Promise((resolve, reject) => {
    console.log(1)
    console.log(2)
    // resolve() 如果不 resolve 则 .then() 不会执行，因为 promise 一直是pending状态
})

promise.then(() => {
    console.log(3);
})

console.log(4)