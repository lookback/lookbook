// Inlined from https://github.com/fengyuanchen/postcss-header (MIT)
const header = (options = {}) => {
  options = Object.assign(
    {
      header: '',
    },
    options
  );

  return {
    postcssPlugin: 'postcss-header',
    Once(css) {
      const header = options.header || options.banner;

      if (header) {
        css.prepend(header);
      }
    },
  };
};

module.exports = header;
module.exports.postcss = true;
