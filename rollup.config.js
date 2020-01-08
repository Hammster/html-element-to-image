const rollupPluginTerser = require('rollup-plugin-terser')

module.exports = {
    input: 'dist/index.js',
    plugins: [rollupPluginTerser.terser()],
    output: [{
        file: 'dist/index.umd.min.js',
        name: 'nodeToDataURL',
        format: 'umd'
    },{
        file: 'dist/index.min.js',
        format: 'es'
    }]
};