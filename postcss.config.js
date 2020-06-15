const { version } = require('./package.json');
const { defaultPlugins } = require('./lib/postcss-plugins');
const minify = require('./lib/plugins/postcss-cssnano-default');
const path = require('path');
const extractMediaQuery = require('./lib/plugins/postcss-extract-media-query');
const header = require('./lib/plugins/postcss-header');

const extractDarkModeQueries = (dest, minify = false) =>
  extractMediaQuery({
    prepend: `/*! lookbook-dark-mode.css v${version} */`,
    output: {
      path: dest,
      name: `[name]-[query]${minify ? '.min' : ''}.css`,
    },
    whitelist: true,
    minimize: minify,
    queries: {
      'screen and (prefers-color-scheme: dark)': 'dark-mode',
    },
  });

// Internal config, used to build *this* .css.
module.exports = (ctx) => ({
  map: ctx.options.map, // Sourcemaps
  plugins: [
    ...defaultPlugins(),
    extractDarkModeQueries(
      path.join(__dirname, 'dist'),
      ctx.env === 'production'
    ),
    header({
      header: `/*! ${ctx.file.basename} v${version} */`,
    }),
    ...(ctx.env === 'production' ? minify() : []),
  ],
});
