const pkg = require('./package.json');
const variables = require('./gen/figma-variables.json');

// Internal config, used to build *this* .css.
module.exports = (ctx) => ({
  map: ctx.options.map, // Sourcemaps
  plugins: {
    'postcss-import': {},
    './postcss/postcss-header': {
      header: `/*! ${ctx.file?.basename || 'stdin'} v${pkg.version} */`,
    },
    './postcss/postcss-figma-variables': {
      variables,
    },
    './postcss/postcss-inject-tailwind': {},
  },
});
