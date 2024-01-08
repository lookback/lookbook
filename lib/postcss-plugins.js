const path = require('path');
const { cyan } = require('./colorize');

const LOOKBOOK_TAILWIND_CONF = path.resolve(
  path.join(__dirname, '..', 'tailwind.config.js')
);

// Looking through all React files for selectors
// that are unused in the CSS, and removes the selectors from the final CSS
const purgeCssOpts = {
  content: [
    // Source tree, with the app view code
    './src/**/*.{tsx,ts}',
    // Often imported components from our (built) lib in node_modules
    './node_modules/@lookback/component/build/**/*.js',
  ],
  safelist: [
    /flex-\d/,
    /flex-grow/,
    /flex-shrink/,
    /LoadingDots/,
    // This protects :where(), :is(), etc.
    /^\:[-a-z]+$/,
  ],
  extractors: [
    {
      extractor(content) {
        // Matches Tailwind class names
        return content.match(/[A-Za-z0-9-_:/]+/g) || [];
      },

      extensions: ['tsx', 'ts'],
    },
  ],
};

exports.defaultPlugins = ({
  pathToTailwindConf = LOOKBOOK_TAILWIND_CONF,
  /** If true, we'll minify and purge unused CSS classes. */
  bundle = false,
} = {}) => {
  console.log(cyan('Using PostCSS plugins from Lookbook with settings:'), {
    pathToTailwindConf,
    bundle,
  });

  return [
    require('postcss-import'),
    require('tailwindcss')(pathToTailwindConf),
    require('postcss-nested'),
    require('postcss-color-function'),
    require('autoprefixer'),
    ...(bundle
      ? [
          require('@fullhuman/postcss-purgecss')(purgeCssOpts),
          require('postcss-csso'),
        ]
      : []),
  ];
};
