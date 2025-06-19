const pkg = require('./package.json');

// Internal config, used to build *this* .css.
module.exports = (ctx) => ({
  map: ctx.options.map, // Sourcemaps
  plugins: {
    'postcss-import': {},
    './postcss/postcss-header': {
      header: `/*! ${ctx.file?.basename || 'stdin'} v${
        pkg.version
      } ${new Date().toISOString()} */`,
    },
    './postcss/postcss-figma-variables': {},
    './postcss/postcss-inject-tailwind': {},
  },
});
