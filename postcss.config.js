const path = require('path');

const pathToTailwindConf = path.resolve(
    path.join(__dirname, 'tailwind.config.js')
);

module.exports = {
    map: 'inline', // Sourcemaps
    plugins: [
        require('postcss-import')(),
        require('tailwindcss')(pathToTailwindConf),
        require('postcss-mixins')(),
        require('postcss-simple-vars')(),
        require('postcss-nested')(),
        require('postcss-color-function')(),
        require('autoprefixer')(),
        require('postcss-hexrgba')(),
        require('cssnano')({ preset: 'default' }),
    ],
};
