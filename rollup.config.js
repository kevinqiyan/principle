import babel from 'rollup-plugin-babel'
export default {
    input: './src/index.js', // 入口
    output: {
        file: './dist/vue.js', // 出口
        name: 'Vue',
        format: 'umd', // umd 兼容 es6
        sourcemap: true, // 调试-map
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
}