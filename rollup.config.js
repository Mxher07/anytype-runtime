import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/anytype.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/anytype.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/anytype.umd.js',
      format: 'umd',
      name: 'AnyTypeRuntime'
    }
  ],
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs()
  ]
};