const json = require('../gen/figma-variables.json');

/**
 * @typedef {object} FigmaVariable
 * @property {string} name The name of the variable.
 * @property {VariableResolvedDataType} type The type of the variable.
 * @property {VariableValue} value The value of the variable.
 * @property {string | null} [target] The target of the variable, if applicable.
 * @property {string | null} [description] The description of the variable, if available.
 */

/** Add Figma variables as Tailwind @theme variables.
 *
 * @return {import('postcss').Plugin}
 */
const plugin = () => {
  const { theme, semantic, primitives } = json;

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
          ...declOf(theme),
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
 * @param {FigmaVariable} v
 * @param {import('postcss').Result} result
 */
const mapVariable = (v, result) => {
  // If the variable is an alias, use the target name instead of the raw value.
  if (v.target) return `var(--${v.target})`;

  if (v.name.startsWith('font-weight')) {
    const weight = FONT_WEIGHT_MAP[v.value.toLowerCase()];
    if (!weight) {
      result.warn(`Unknown font weight "${v.value}" for variable "${v.name}".`);
      return v.value;
    }

    return weight;
  }

  return valueOf(v) + unitOf(v);
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

/**
 * @param {FigmaVariable} v
 */
const valueOf = (v) => {
  switch (v.type) {
    case 'COLOR':
      return rgbaToLch(v.value);
    case 'FLOAT': {
      return parseFloat(v.value.toFixed(3));
    }
    case 'BOOLEAN':
    case 'STRING':
      return v.value;
  }
};

/**
 * @param {RGBA | RGB} rgba
 */
const rgbaToLch = (rgba) => {
  const srgbToLinear = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const { r, g, b, a: alpha } = rgba;

  // RGB => linear RGB
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);

  // linear RGB => OKLAB
  const l = 0.412165612 * rLin + 0.536275208 * gLin + 0.0514575653 * bLin;
  const m = 0.211859107 * rLin + 0.6807189584 * gLin + 0.107406579 * bLin;
  const s = 0.0883097947 * rLin + 0.2818474174 * gLin + 0.6299787005 * bLin;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // OKLAB => OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  // Handle achromatic colors (when chroma is very close to 0)
  if (C < 0.0001) H = 0;

  return alpha != null && alpha != 1
    ? `oklch(${L} ${C} ${H} / ${alpha})`
    : `oklch(${L} ${C} ${H})`;
};

plugin.postcss = true;
module.exports = plugin;
