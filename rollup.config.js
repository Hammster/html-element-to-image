const rollupPluginTerser = require('rollup-plugin-terser')

module.exports = {
    input: 'dist/index.js',
    plugins: [rollupPluginTerser.terser()],
    output: [{
        file: 'dist/index.cjs.min.js',
        format: 'cjs'
    },{
        file: 'dist/index.min.js',
        format: 'es'
    }]
};