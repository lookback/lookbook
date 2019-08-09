const onlyWhitelist = (colorName) =>
  !['white', 'transparent', 'defaultBoxShadow'].includes(colorName);

/**
 * Tailwind plugin that adds Lookback's colour variables
 * as custom CSS properties on an element.
 *
 * Produces:
 *
 * ```css
 * :root {
 *    --someColorName: #fff;
 * }
 * ```
 */
module.exports = function variables(element = ':root') {
  return function({ addBase, theme }) {
    const colors = theme('colors');

    addBase({
      [element]: Object.assign(
        {
          '--default-border-color': theme('borderColor.default'),
          '--default-text-color': theme('textColor.default'),
          '--default-background-color': theme('backgroundColor.default'),
        },
        ...Object.keys(colors)
          .filter(onlyWhitelist)
          .map((color) => ({
            [`--${color}`]: colors[color],
          }))
      ),
    });
  };
};
