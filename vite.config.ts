import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        // compresses and minifies the code
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            mangle: true, // shortens variable names
            format: {
                comments: false // strips all comments
            }
        },

        rollupOptions: {
            input: 'index.html',
            output: {
                entryFileNames: 'main.js',
                assetFileNames: 'style.css',
            }
        }
    },
    base: './'
})