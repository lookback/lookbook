const path = require('path');

const LOOKBOOK_TAILWIND_CONF = path.resolve(
    path.join(__dirname, 'tailwind.config.js')
);

module.exports = ({ pathToTailwindConf = LOOKBOOK_TAILWIND_CONF } = {}) => ({
    map: 'inline', // Sourcemaps
    plugins: [
        require('postcss-import')(),
        require('tailwindcss')(pathToTailwindConf),
        require('postcss-nested')(),
        require('postcss-color-function')(),
        require('postcss-hexrgba')(),
        require('autoprefixer')(),
        require('cssnano')({ preset: 'default' }),
    ],
});
