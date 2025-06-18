const json = require('../gen/figma-variables.json');

/**
 * @typedef {object} FigmaVariable
 * @property {string} name - The name of the variable.
 * @property {string | number} value - The value of the variable.
 * @property {string | null} [target] - The target of the variable, if applicable.
 * @property {string | null} [description] - The description of the variable, if available.
 */

/** Add Figma variables as Tailwind @theme variables.
 *
 * @return {import('postcss').Plugin}
 */
const plugin = () => {
  const { tokens, semantic, primitives } = json;

  return {
    postcssPlugin: 'postcss-tokens',

    AtRule: {
      'figma-variables': (atRule, { Declaration, result }) => {
        /** @param {FigmaVariable[]} tokens */
        const declOf = (tokens) => {
          return tokens
            .filter((t) => {
              if (/\s+/.test(t.name)) {
                result.warn(
                  `Skipping variable "${t.name}" as it contains whitespace.`,
                  { node: atRule }
                );
                return false;
              }
              return true;
            })
            .map(
              (t) =>
                new Declaration({
                  prop: `--${t.name}`,
                  value: mapVariable(t, result),
                })
            );
        };

        atRule.replaceWith([
          ...declOf(primitives),
          ...declOf(semantic),
          ...declOf(tokens),
        ]);
      },
    },
  };
};

const FONT_WEIGHT_MAP = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

/**
 * @param {FigmaVariable} t
 * @param {import('postcss').Result} result
 */
const mapVariable = (t, result) => {
  // If the variable is an alias, use the target name instead of the raw value.
  if (t.target) return `var(--${t.target})`;

  if (t.name.startsWith('font-weight')) {
    const weight = FONT_WEIGHT_MAP[t.value.toLowerCase()];
    if (!weight) {
      result.warn(`Unknown font weight "${t.value}" for variable "${t.name}".`);
      return t.value;
    }

    return weight;
  }

  return t.value + unitOf(t);
};

const UNIT_LESS = ['leading'];

/** @param {FigmaVariable} t */
const unitOf = (t) => {
  if (UNIT_LESS.some((needle) => t.name.includes(needle))) {
    return '';
  }

  if (typeof t.value === 'number') {
    return 'px';
  }

  return '';
};

plugin.postcss = true;
module.exports = plugin;
