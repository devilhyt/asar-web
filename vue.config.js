const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')


module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://asar.lisontech.net',
                ws: true,
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            }
        }
    },
    configureWebpack: {
        plugins: [new NodePolyfillPlugin()],
        optimization: {
            splitChunks: {
            chunks: "all",
            },
        },
    },
})
