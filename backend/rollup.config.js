import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import fs from 'node:fs';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const env = dotenv.parse(fs.readFileSync('./.env', 'utf-8'));

export default {
    input: './src/main.ts',
    output: {
        file: './build/main.js',
        format: 'es',
        name: 'main',
        sourcemap: true,
    },
    plugins: [
        json(),
        replace({
            values: Object.fromEntries(
                Object.keys(env).map((k) => [`process.env.${k}`, `'${env[k]}'`])
            ),
            preventAssignment: true,
        }),
        peerDepsExternal(),
        commonjs(),
        nodeResolve(),
        typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: Object.keys(packageJson.dependencies),
};
