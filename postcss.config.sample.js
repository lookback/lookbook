const { defaultPostCssPlugins } = require('@lookback/lookbook');

const BUNDLE = !!process.env.BUNDLE;

module.exports = {
  map: !BUNDLE && {
    inline: true,
  },
  plugins: [
      // Sending bundle: true to defaultPostCssPlugins() will:
      // 1) Purge unused CSS rules.
      // 2) Minify the full bundle.
      //
      // more plugins here..
      ...defaultPostCssPlugins({ bundle: BUNDLE })
      // .. and maybe here
  ],
};
