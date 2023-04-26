import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';

const plugins = [
    external(),
    resolve({browser: true}),
    commonjs(),
    replace({values: {'process.env.NODE_ENV': JSON.stringify('production')}, preventAssignment: true}),
    typescript({tsconfig: './tsconfig.json'}),
];

export default [
    {
        input: './extension/scripts/background.ts',
        output: {
            file: './extension/build/background.js',
            format: 'iife',
            name: 'background',
            sourcemap: true,
        },
        plugins,
    },
    {
        input: './extension/scripts/content.tsx',
        output: {
            file: './extension/build/content.js',
            format: 'iife',
            name: 'content',
            sourcemap: true,
        },
        plugins,
    }
];
