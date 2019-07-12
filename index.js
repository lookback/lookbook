const colors = require('./colors');
const tailwindConfig = require('./tailwind.config');
const { defaultPlugins } = require('./lib/postcss-plugins');

exports.colors = colors;
exports.tailwindConfig = tailwindConfig;

/** PostCSS config for external use. */
exports.postCssConfig = ({ pathToTailwindConf } = {}) => () => ({
  map: 'inline', // Sourcemaps
  plugins: defaultPlugins({ pathToTailwindConf }),
});

exports.defaultPostCssPlugins = defaultPlugins;
