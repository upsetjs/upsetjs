import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import cleanup from 'rollup-plugin-cleanup';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

const banner = `/**
 * ${pkg.name}
 * ${pkg.homepage}
 *
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.email}>
 */
`;

/**
 * defines which formats (umd, esm, cjs, types) should be built when watching
 */
const watchOnly = ['esm', 'types'];

const isDependency = (v) => Object.keys(pkg.dependencies || {}).some((e) => e === v || v.startsWith(e + '/'));
const isPeerDependency = (v) => Object.keys(pkg.peerDependencies || {}).some((e) => e === v || v.startsWith(e + '/'));

export default (options) => {
  const buildFormat = (format) => !options.watch || watchOnly.includes(format);

  const base = {
    input: './src/index.ts',
    output: {
      sourcemap: true,
      banner,
      globals: {},
      exports: 'named',
    },
    external: (v) => isDependency(v) || isPeerDependency(v),
    plugins: [
      replace({
        // eslint-disable-next-line no-undef
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'production',
        // "from 'react';": `from 'preact/compat/dist/compat.module.js';`,
        __VERSION__: JSON.stringify(pkg.version),
        // delimiters: ['', ''],
      }),
      alias({
        entries: [{ find: 'react', replacement: require.resolve('preact/compat/dist/compat.module.js') }],
      }),
      resolve(),
      commonjs(),
      typescript(),
      babel({ presets: ['@babel/env'], babelHelpers: 'bundled' }),
      cleanup({
        comments: ['some', 'ts', 'ts3s'],
        extensions: ['ts', 'tsx', 'js', 'jsx'],
      }),
    ],
  };
  return [
    (buildFormat('esm') || buildFormat('cjs')) && {
      ...base,
      output: [
        buildFormat('esm') && {
          ...base.output,
          file: pkg.module,
          format: 'esm',
        },
        buildFormat('cjs') && {
          ...base.output,
          file: pkg.main,
          format: 'cjs',
        },
      ].filter(Boolean),
    },
    ((buildFormat('umd') && pkg.browser) || (buildFormat('umd-min') && pkg.unpkg)) && {
      ...base,
      input: fs.existsSync(base.input.replace('.ts', '.umd.ts')) ? base.input.replace('.ts', '.umd.ts') : base.input,
      output: [
        buildFormat('umd') &&
          pkg.browser && {
            ...base.output,
            sourcemap: false,
            file: pkg.browser,
            format: 'umd',
            name: pkg.global,
          },
        buildFormat('umd-min') &&
          pkg.unpkg && {
            ...base.output,
            sourcemap: false,
            file: pkg.unpkg,
            format: 'umd',
            name: pkg.global,
            plugins: [terser()],
          },
      ].filter(Boolean),
      external: (v) => isPeerDependency(v),
    },
    buildFormat('types') && {
      ...base,
      output: {
        ...base.output,
        file: pkg.types,
        format: 'es',
      },
      external: (v) => isPeerDependency(v) || isDependency(v) || v === 'react' || v.startsWith('preact'),
      plugins: [
        alias({
          entries: [{ find: 'react', replacement: require.resolve('preact/compat/dist/compat.module.js') }],
        }),
        dts({
          compilerOptions: {
            removeComments: false,
          },
          respectExternal: true,
        }),
      ],
    },
  ].filter(Boolean);
};
