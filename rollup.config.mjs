import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
  input: 'package/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  ],

  external: (id) => {
    // 排除所有 node_modules 中的模块
    return id.includes('node_modules');
  },

  plugins: [
    // 注意：如果使用了 external，可能不需要 peerDepsExternal
    // peerDepsExternal(), // 可以注释掉这行
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/components': path.resolve(__dirname, 'src/components'),
      },
    }),
    commonjs(),
    json(),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};