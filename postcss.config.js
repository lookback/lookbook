const { version } = require('./package.json');
const { defaultPlugins } = require('./conf/postcss-plugins');

// Internal config, used to build *this* .css.
module.exports = () => ({
    map: 'inline', // Sourcemaps
    plugins: [
        ...defaultPlugins(),
        require('./src/plugins/postcss-header')({
            header: `/*! lookbook.css v${version} */`,
        }),
        require('cssnano')({ preset: 'default' }),
    ],
});
