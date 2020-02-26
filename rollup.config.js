import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package');

const input = 'src/index.ts';
const output = {
  es: `lib/index.es.js`,
  cjs: `lib/index.cjs.js`,
};
const packageName = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1);
const banner = `/*  ${packageName} v${pkg.version}
 *  https://github.com/phixid/${pkg.name}
 *  (c) ${new Date().getFullYear()} ${pkg.author}
 *  ${packageName} may be freely distributed under the ${pkg.license} license.
 */
`;

const config = {
  input: input,
  output: {},
  plugins: [resolve(), commonjs()],
};

if (process.env.NODE_ENV === 'ES') {
  config.plugins.push(
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6',
        },
      },
    }),
  );
  config.output = {
    banner: banner,
    file: output.es,
    format: 'es',
    name: packageName,
  };
}

if (process.env.NODE_ENV === 'CJS') {
  config.plugins.push(
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          target: 'es5',
        },
      },
    }),
  );
  config.output = {
    banner: banner,
    file: output.cjs,
    format: 'cjs',
    name: packageName,
  };
}

module.exports = config;
