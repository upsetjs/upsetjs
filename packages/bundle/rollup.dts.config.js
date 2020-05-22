import dts from 'rollup-plugin-dts';

export default {
  input: './.tmp/index.d.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  external: ['react'],
  plugins: [
    dts({
      respectExternal: true,
    }),
  ],
};
