const { version } = require('./package.json');
const header = require('./lib/plugins/postcss-header');

// Internal config, used to build *this* .css.
module.exports = (ctx) => ({
  map: ctx.options.map, // Sourcemaps
  plugins: [
    require('postcss-import'),
    header({
      header: `/*! ${
        ctx.file.basename
      } v${version} ${new Date().toISOString()} */`,
    }),
  ],
});
