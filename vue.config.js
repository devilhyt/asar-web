const { defineConfig } = require('@vue/cli-service')


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
  }
})
