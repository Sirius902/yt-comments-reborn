import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const plugins = [
    json(),
    peerDepsExternal(),
    commonjs(),
    nodeResolve(),
    typescript({ tsconfig: './tsconfig.json' }),
];

export default {
    input: './src/main.ts',
    output: {
        file: './build/main.js',
        format: 'es',
        name: 'main',
        sourcemap: true
    },
    plugins,
    external: Object.keys(packageJson.dependencies),
};
