import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
    server: {
        port: 3000,
    },
    define: {
        global: 'window', //  fixes Draft.js / fbjs global error
    },
    build: {
        sourcemap: true,   // optional, helpful for debugging
        outDir: 'dist',    // default, but ensures consistency
    },
    base: './',          //  ensures relative paths for assets in production
});

