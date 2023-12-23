const promise = new Promise((resolve, reject) => {
    console.log('promise');
    resolve('resolve-1')
})

const promise2 = promise.then(res => {
    console.log(res)
})

console.log(1, promise);
console.log(2,promise2);
