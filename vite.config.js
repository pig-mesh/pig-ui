import {defineConfig, loadEnv} from 'vite'
import createVitePlugins from './vite/plugins'

const {resolve} = require('path')
export default defineConfig(({mode, command}) => {
    const env = loadEnv(mode, process.cwd())
    return {
        server: {
            port: 8080,
            proxy: {
                '/api': {
                    target: 'http://pig-gateway:9999',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "./src"),
                "components": resolve(__dirname, "./src/components"),
                "styles": resolve(__dirname, "./src/styles"),
                "utils": resolve(__dirname, "./src/utils"),
            }
        },
        plugins: createVitePlugins(env, command === 'build')
    }
})
