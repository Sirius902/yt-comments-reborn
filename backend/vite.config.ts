import {defineConfig} from 'vite';

export default defineConfig({
    build: {
        outDir: 'build',
        sourcemap: true,
        ssr: true,
        rollupOptions: {
            input: '/src/main.ts',
        },
    },
});
