import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';

const plugins = [
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
];

export default [
    {
        input: './extension/scripts/background.ts',
        output: {
            file: './extension/build/background.js',
            format: 'iife',
            name: 'background',
            sourcemap: true
        },
        plugins,
    },
    {
        input: './extension/scripts/content.ts',
        output: {
            file: './extension/build/content.js',
            format: 'iife',
            name: 'content',
            sourcemap: true
        },
        plugins
    }
];
