/**
 * Replaces `/* =inject-tailwind` with @imports from `tailwindcss` on appropriate layers.
 *
 * @return {import('postcss').Plugin}
 */
const plugin = () => {
  return {
    postcssPlugin: 'postcss-inject-tailwind',
    Once(root, { AtRule }) {
      const importOf = (importPath, layer) =>
        new AtRule({
          name: 'import',
          params: `'${importPath}' layer(${layer})`,
        });

      root.walkComments((comment) => {
        if (comment.text.trim() == '=inject-tailwind') {
          const imports = [
            importOf('tailwindcss/theme.css', 'theme'),
            importOf('tailwindcss/preflight.css', 'base'),
            importOf('tailwindcss/utilities.css', 'utilities'),
          ];
          comment.replaceWith(...imports);
        }
      });
    },
  };
};

plugin.postcss = true;
module.exports = plugin;
