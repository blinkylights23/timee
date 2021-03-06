import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'timee',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      nodePolyfills(),
      nodeResolve({ browser: true }),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      })
    ]
  },

  {
    input: 'src/index.js',
    external: ['events', 'dayjs'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]
