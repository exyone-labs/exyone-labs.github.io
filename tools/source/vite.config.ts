import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// https://vite.dev/config/
export default defineConfig({
    base: '/tools/',
    plugins: [
        vue(),
        AutoImport({
            imports: ["vue", "vue-router"],
            dts: 'types/auto-imports.d.ts'
        }),
        Components({
            dts: 'types/components.d.ts',
            dirs: ['src/components'],
            importPathTransform: (path) => {
                return path.replace(/^.+\/src\//, '@/')
            }
        }),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        hmr: {
            overlay: false
        },
        port: 10011
    },
    build: {
        outDir: '../',
        emptyOutDir: false
    }
})
