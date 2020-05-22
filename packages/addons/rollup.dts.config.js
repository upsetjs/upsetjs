import dts from 'rollup-plugin-dts';

export default {
  input: './.tmp/index.d.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  external: ['@upsetjs/model', '@upsetjs/math', '@upsetjs/react', 'react'],
  plugins: [
    dts({
      respectExternal: true,
    }),
  ],
};
