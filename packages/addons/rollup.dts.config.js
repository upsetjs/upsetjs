import dts from 'rollup-plugin-dts';

export default {
  input: './src/index.ts',
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
