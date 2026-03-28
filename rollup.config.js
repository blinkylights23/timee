import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import nodePolyfills from 'rollup-plugin-node-polyfills'

const outputPaths = {
  "main": "dist/timee.cjs.js",
  "module": "dist/timee.esm.js",
  "browser": "dist/timee.umd.js"
}

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'timee',
      file: outputPaths.browser,
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
    external: ['events', 'dayjs', 'dayjs/plugin/duration', 'dayjs/plugin/relativeTime'],
    output: [
      { file: outputPaths.main, format: 'cjs' },
      { file: outputPaths.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]
