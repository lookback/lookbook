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
            .map((t) => {
              // If the variable is an alias, use the target name instead of the raw value.
              const value = t.target ? `var(--${t.target})` : unitOf(t);

              return new Declaration({
                prop: `--${t.name}`,
                value,
              });
            });
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

const UNIT_LESS = ['leading'];

/** @param {FigmaVariable} t */
const unitOf = (t) => {
  if (UNIT_LESS.some((needle) => t.name.includes(needle))) {
    return t.value;
  }

  if (typeof t.value === 'number') {
    return `${t.value}px`;
  }

  return t.value;
};

plugin.postcss = true;
module.exports = plugin;
