// A React/Preact centric PostCSS config for Lookbook

// Default PostCSS plugins in able for the Lookbook to work
const { defaultPostCssPlugins } = require('@lookback/lookbook');
// Purge unused CSS from the final bundle
const purgecss = require('@fullhuman/postcss-purgecss');
// Minify CSS
const csso = require('postcss-csso');

const BUNDLE = !!process.env.BUNDLE;

// Looking through all JSX files for selectors
// that are unused in the CSS, and removes the selectors from the final CSS
const purgeCssOpts = {
  content: [
    './src/**/*.{tsx,ts}',
    './node_modules/@lookback/component/build/**/*.js',
    // other file paths to template/component code which is
    // making use of Lookbook CSS classes.
  ],
  whitelistPatterns: [/flex-\d/, /flex-grow/, /flex-shrink/],
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

module.exports = {
  map: !BUNDLE && {
    inline: true,
  },
  plugins: [
    ...defaultPostCssPlugins(),
    // Purge unused selectors and minify CSS when bundling
    ...(BUNDLE ? [purgecss(purgeCssOpts), csso] : []),
  ],
};
