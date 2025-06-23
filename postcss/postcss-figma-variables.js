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
 * This plugin will find a `@figma-variables` mark in the input and replace it with `--var: name` declarations.
 * Thus, the `@figma-variables` mark MUST be inside of a valid selector, such as `:root`.
 *
 * @param {object} options
 * @param {object} options.variables The imported Figma variables, such as `require('./gen/figma-variables.json')`.
 * @return {import('postcss').Plugin}
 */
const plugin = ({ variables }) => {
  const { theme, semantic, primitives } = variables;

  return {
    postcssPlugin: 'postcss-figma-variables',

    AtRule: {
      'figma-variables': (atRule, { Declaration, result }) => {
        /** @param {FigmaVariable[]} variables */
        const declOf = (variables) => {
          return variables
            .filter((v) => {
              if (/\s+/.test(v.name)) {
                result.warn(
                  `Skipping variable "${v.name}" as it contains whitespace.`,
                  { node: atRule }
                );
                return false;
              }
              return true;
            })
            .map(
              (v) =>
                new Declaration({
                  prop: `--${nameOf(v.name, v.type)}`,
                  value: transformValue(v, result),
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

/**
 * @param {string} name
 * @param {VariableResolvedDataType} type
 * @param {import('postcss').Result} result
 */
const nameOf = (name, type) => {
  // We prepend color- to make sure Tailwind can use it as a color.
  if (type == 'COLOR') {
    return `color-${name}`;
  }

  return name;
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
const transformValue = (v, result) => {
  // If the variable is an alias, use the target name instead of the raw value.
  if (v.target) return `var(--${nameOf(v.target, v.type)})`;

  if (v.name.startsWith('font-weight')) {
    const weight = FONT_WEIGHT_MAP[v.value.toLowerCase()];
    if (!weight) {
      result.warn(`Unknown font weight "${v.value}" for variable "${v.name}".`);
      return v.value;
    }

    return weight;
  }

  if (REM_UNIT.some((prefix) => v.name.startsWith(prefix))) {
    if (typeof v.value === 'number') {
      const rem = v.value / 16;
      return `${rem}rem`;
    } else {
      result.warn(
        `"${v.name}" is marked as using the rem unit, but value is not a number: ${v.value}`
      );
    }
  }

  return valueOf(v) + unitOf(v);
};

const UNIT_LESS = ['leading-'];

const REM_UNIT = [
  'spacing-',
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
];

/** @param {FigmaVariable} v */
const unitOf = (v) => {
  if (UNIT_LESS.some((needle) => v.name.startsWith(needle))) {
    return '';
  }

  if (typeof v.value === 'number') {
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
