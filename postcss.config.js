const { version } = require('./package.json');
const { defaultPlugins } = require('./lib/postcss-plugins');
const minify = require('./src/plugins/cssnano-default');

// Internal config, used to build *this* .css.
module.exports = (ctx) => ({
    map: ctx.options.map, // Sourcemaps
    plugins: [
        ...defaultPlugins(),
        require('./src/plugins/postcss-header')({
            header: `/*! lookbook.css v${version} */`,
        }),
        ...(ctx.env === 'production' ? minify() : []),
    ],
});
