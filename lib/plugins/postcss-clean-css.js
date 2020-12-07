const CleanCss = require('clean-css');

// From https://github.com/leodido/postcss-clean
const clean = (opts = {}) => {
  const cleancss = new CleanCss(opts);

  return {
    postcssPlugin: 'postcss-clean-css',

    Once(css, { parse, warn }) {
      return new Promise((resolve, reject) => {
        cleancss.minify(css.toString(), (err, min) => {
          if (err) {
            return reject(new Error(err.join('\n')));
          }

          for (let w of min.warnings) {
            warn(w);
          }

          console.log(
            `minify: ${min.stats.originalSize}B -> ${min.stats.minifiedSize}B (${min.stats.timeSpent}ms)`
          );

          css = parse(min.styles);
          resolve();
        });
      });
    },
  };
};

module.exports = clean;
module.exports.postcss = true;
