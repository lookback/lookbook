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
    OnceExit(css) {
      const header = options.header || options.banner;

      if (header) {
        const firstNode = css.nodes[0];

        // @charset rules must come before everything else
        if (firstNode?.type == 'atrule' && firstNode.name == 'charset') {
          firstNode.after('\n\n' + header);
        } else {
          css.prepend(header);
        }
      }
    },
  };
};

module.exports = header;
module.exports.postcss = true;
