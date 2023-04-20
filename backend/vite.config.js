import {defineConfig} from 'vite';

export default defineConfig({
    ssr: {
        target: 'node',
        format: 'esm',
    },
    build: {
        target: 'esnext',
        outDir: 'build',
        sourcemap: true,
        ssr: true,
        rollupOptions: {
            input: '/src/main.ts',
        },
    },
});
