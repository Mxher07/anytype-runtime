import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/anytype.js',
  output: [
    {
      file: 'dist/anytype.esm.js',
      format: 'esm',
      sourcemap: !isProduction
    },
    {
      file: 'dist/anytype.cjs.js',
      format: 'cjs',
      sourcemap: !isProduction
    },
    {
      file: 'dist/anytype.umd.js',
      format: 'umd',
      name: 'AnyTypeRuntime',
      sourcemap: !isProduction
    }
  ],
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    isProduction && terser()
  ]
};