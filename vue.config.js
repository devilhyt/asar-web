const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const { readdirSync } = require('fs')
const getDirectories = source => readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
      
process.env.VUE_APP_BLOCKLYDIR = getDirectories("./src/assets/blockly/blocks")

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://asar.lisontech.net',
                ws: true,
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            },
            '/socket.io': {
                target: 'http://rasa.lisontech.net',
                ws: true,
                changeOrigin: true
            }
        }
    },
    configureWebpack: {
        plugins: [new NodePolyfillPlugin()],
        optimization: {
            splitChunks: {
                chunks: "all"
            },
        },
    },
})
