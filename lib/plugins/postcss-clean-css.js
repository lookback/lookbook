const CleanCss = require('clean-css');

// From https://github.com/leodido/postcss-clean
const clean = (
  opts = {
    stats: false,
  }
) => {
  const { stats, ...rest } = opts;
  const cleancss = new CleanCss(rest);

  return {
    postcssPlugin: 'postcss-clean-css',

    Once(css, { result, parse, warn }) {
      return new Promise((resolve, reject) => {
        cleancss.minify(css.toString(), (err, min) => {
          if (err) {
            return reject(new Error(err.join('\n')));
          }

          for (let w of min.warnings) {
            warn(w);
          }

          if (stats) {
            console.log(
              `minify: ${min.stats.originalSize}B -> ${min.stats.minifiedSize}B (${min.stats.timeSpent}ms)`
            );
          }

          result.root = parse(min.styles);
          resolve();
        });
      });
    },
  };
};

module.exports = clean;
module.exports.postcss = true;
