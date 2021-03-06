const path = require('path');
const THREE = require('three');

module.exports = {
    entry: {
        main: './src/index.js',
        shader: './src/shader.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    // development server options
    devServer: {
        contentBase: path.join(__dirname, "dist")
    }
};