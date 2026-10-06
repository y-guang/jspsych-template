import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        target: ['chrome87', 'edge88', 'firefox78', 'safari14'],
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

        rolldownOptions: {
            input: 'index.html',
            output: {
                entryFileNames: 'main.js',
                assetFileNames: (asset) => asset.names.some((name) => name.endsWith('.css'))
                    ? 'style.css'
                    : 'assets/[name]-[hash][extname]',
            }
        }
    },
    base: './'
})
