import pkg from './package.json' assert { type: 'json' };

// Internal config, used to build *this* .css.
export default (ctx) => ({
  map: ctx.options.map, // Sourcemaps
  plugins: {
    'postcss-import': {},
    './postcss/postcss-header.mjs': {
      header: `/*! ${
        ctx.file.basename
      } v${pkg.version} ${new Date().toISOString()} */`,
    },
  },
});
