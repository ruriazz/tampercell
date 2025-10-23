import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const basePlugins = [
  typescript({
    declaration: false,
    sourceMap: true,
  }),
  resolve({
    browser: true,
    alias: {
      '@types': './types/index.ts'
    }
  }),
  commonjs(),
];

const customConsolePlugins = [
  typescript({
    declaration: false,
    sourceMap: true,
  }),
  postcss({
    extract: 'main.css',
    minimize: false,
    sourceMap: true,
  }),
  resolve({
    browser: true,
    alias: {
      '@types': './types/index.ts'
    }
  }),
  commonjs(),
];

const customConsolePluginsMinified = [
  typescript({
    declaration: false,
    sourceMap: true,
  }),
  postcss({
    extract: 'main.min.css',
    minimize: true,
    sourceMap: true,
  }),
  resolve({
    browser: true,
    alias: {
      '@types': './types/index.ts'
    }
  }),
  commonjs(),
];

export default [
  // ES modules and CJS builds (support multiple entry points)
  {
    input: {
      'next-observer': 'src/next-observer/index.ts',
    },
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name]/main.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        dir: 'dist',
        entryFileNames: '[name]/main.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: basePlugins,
  },
  {
    input: 'src/custom-console/index.ts',
    output: [
      {
        file: 'dist/custom-console/main.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/custom-console/main.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: customConsolePlugins,
  },
  // UMD builds (single entry point each)
  {
    input: 'src/next-observer/index.ts',
    output: [
      {
        file: 'dist/next-observer/main.js',
        format: 'umd',
        name: 'NextObserver',
        sourcemap: true,
      },
      {
        file: 'dist/next-observer/main.min.js',
        format: 'umd',
        name: 'NextObserver',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: basePlugins,
  },
  {
    input: 'src/custom-console/index.ts',
    output: [
      {
        file: 'dist/custom-console/main.js',
        format: 'umd',
        name: 'CustomConsole',
        sourcemap: true,
      },
    ],
    plugins: customConsolePlugins,
  },
  {
    input: 'src/custom-console/index.ts',
    output: [
      {
        file: 'dist/custom-console/main.min.js',
        format: 'umd',
        name: 'CustomConsole',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: customConsolePluginsMinified,
  },
];
