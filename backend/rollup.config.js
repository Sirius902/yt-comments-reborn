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

export default {
    input: './src/main.ts',
    output: {
        file: './build/main.js',
        format: 'iife',
        name: 'main',
        sourcemap: true
    },
    plugins,
};
