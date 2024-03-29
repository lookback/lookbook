const colors = require('./colors.json');
const tailwindConfig = require('./tailwind.config');
const { defaultPlugins } = require('./lib/postcss-plugins');

exports.colors = colors;
exports.tailwindConfig = tailwindConfig;

/** PostCSS config for external use. */
exports.postCssConfig = ({ pathToTailwindConf, bundle } = {}) => () => ({
  map: 'inline', // Sourcemaps
  plugins: defaultPlugins({ pathToTailwindConf, bundle }),
});

exports.defaultPostCssPlugins = defaultPlugins;
