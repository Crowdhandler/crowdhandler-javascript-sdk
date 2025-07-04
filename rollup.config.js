/**
 * Rollup Configuration for CrowdHandler SDK
 * 
 * This creates multiple build outputs:
 * 1. ESM (ES Modules) - For modern bundlers and Node.js with "type": "module"
 * 2. CJS (CommonJS) - For Node.js require() statements
 * 3. UMD (Universal) - For browsers via <script> tags and older environments
 */

import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

// External dependencies that shouldn't be bundled
// For Node builds, we keep these external
// For browser builds, we'll bundle them
const external = Object.keys(pkg.dependencies || {});

// Banner to add to all builds
const banner = `/**
 * CrowdHandler JavaScript SDK v${pkg.version}
 * (c) ${new Date().getFullYear()} CrowdHandler
 * @license ISC
 */`;

export default [
  // ====================
  // Browser builds (UMD)
  // ====================
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/crowdhandler.umd.js',
        format: 'umd',
        name: 'crowdhandler', // This creates window.crowdhandler
        banner,
        sourcemap: true,
      },
      {
        file: 'dist/crowdhandler.umd.min.js',
        format: 'umd',
        name: 'crowdhandler',
        banner,
        sourcemap: true,
        plugins: [terser()] // Minified version
      }
    ],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'typeof window': JSON.stringify('object'),
          'process.env.NODE_ENV': JSON.stringify('production')
        }
      }),
      alias({
        entries: [
          // Force axios to use its browser build
          { find: 'axios', replacement: require.resolve('axios/dist/axios.js') }
        ]
      }),
      resolve({
        browser: true, // Use browser-friendly versions of Node modules
        preferBuiltins: false, // Don't use Node built-ins
        mainFields: ['browser', 'module', 'main'] // Prefer browser field in package.json
      }),
      commonjs(), // Convert CommonJS modules to ES6
      json(), // Allow importing JSON files
      typescript({
        tsconfig: './tsconfig.rollup.json',
        declaration: false // We'll generate .d.ts files separately
      })
    ]
    // Note: No external for UMD - we bundle everything for browsers
  },

  // ====================
  // Node.js builds (ESM & CJS)
  // ====================
  {
    input: 'src/index.ts',
    external, // Keep dependencies external for Node
    output: [
      {
        file: 'dist/crowdhandler.esm.js',
        format: 'es', // ES modules
        banner,
        sourcemap: true
      },
      {
        file: 'dist/crowdhandler.cjs.js',
        format: 'cjs', // CommonJS
        banner,
        sourcemap: true,
        exports: 'named' // Support both default and named exports
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: true // Use Node built-ins when available
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.rollup.json',
        declaration: true, // Generate .d.ts files
        declarationDir: './dist/types',
        rootDir: 'src/'
      })
    ]
  }
];