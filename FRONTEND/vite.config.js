import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        target: 'es2020',
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-wagmi': ['@wagmi/core', 'viem'],
                    'vendor-reown': ['@reown/appkit', '@reown/appkit-adapter-wagmi']
                }
            }
        },
        cssMinify: true,
        assetsInlineLimit: 8192,
        chunkSizeWarningLimit: 600,
        sourcemap: false
    },
    esbuild: {
        drop: ['console', 'debugger'],
    },
    server: {
        port: 5173,
        open: true
    }
});
