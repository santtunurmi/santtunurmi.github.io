import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['import', 'if-function', 'global-builtin', 'color-functions'],
            },
        },
    },
    build: {
        outDir: 'docs',
        emptyOutDir: true,
    },
})
