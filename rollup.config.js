const terser = require('@rollup/plugin-terser');

module.exports = {
    input: 'dist/index.js',
    plugins: [terser()],
    output: [{
        file: 'dist/index.umd.min.js',
        name: 'nodeToDataURL',
        format: 'umd'
    },{
        file: 'dist/index.cjs.min.js',
        format: 'cjs'   
    },{
        file: 'dist/index.min.js',
        format: 'es'
    }]
};