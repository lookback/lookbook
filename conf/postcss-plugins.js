const path = require('path');

const LOOKBOOK_TAILWIND_CONF = path.resolve(
    path.join(__dirname, '..', 'tailwind.config.js')
);

exports.defaultPlugins = ({
    pathToTailwindConf = LOOKBOOK_TAILWIND_CONF,
} = {}) => [
    require('postcss-import')(),
    require('tailwindcss')(pathToTailwindConf),
    require('postcss-nested')(),
    require('postcss-color-function')(),
    require('postcss-hexrgba')(),
    require('autoprefixer')(),
];
