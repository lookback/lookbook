const SHORTHAND_HEX_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const onlyWhitelist = (colorName) =>
  !['white', 'transparent', 'defaultBoxShadow'].includes(colorName);

const isHex = (colorName) => /^#[a-f\d]/i.test(colorName);

const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  hex = hex.replace(SHORTHAND_HEX_REGEX, (_, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = HEX_REGEX.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const toProfile = (colorProfileName, color) => {
  const rgb = hexToRgb(color);

  if (!rgb) {
    console.warn(
      `Skipping converting ${color} to Display P3 as it's ${rgb} when converted to RGB.`
    );
    return color;
  }

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // color(p3 1.0 0 0 / 1);
  return `color(${colorProfileName} ${r} ${g} ${b} / 1)`;
};
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
module.exports = function variables(element = ':root', useP3 = true) {
  return function({ addBase, theme }) {
    const colors = theme('colors');

    const styles = {
      [element]: Object.assign(
        {},
        ...Object.keys(colors)
          .filter(onlyWhitelist)
          .map((color) => ({
            [`--${color}`]: colors[color],
          }))
      ),
    };

    if (useP3) {
      console.log(
        `💅 Using P3 color space to generate CSS color variables on ${element}...`
      );
      styles['@supports (color: color(display-p3 1 1 1 / 1))'] = {
        [element]: Object.assign(
          {},
          ...Object.keys(colors)
            .filter(
              (colorName) =>
                onlyWhitelist(colorName) && isHex(colors[colorName])
            )
            .map((colorName) => ({
              [`--${colorName}`]: toProfile('display-p3', colors[colorName]),
            }))
        ),
      };
    }

    addBase(styles);
  };
};
