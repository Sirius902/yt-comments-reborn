import {defineConfig} from 'vite';

export default defineConfig({
    test: {
        setupFiles: ['./src/__tests__/env.ts'],
    },
});
