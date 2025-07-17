const styleColors = require('./colors.json');

/** Root font size without unit. */
const baseSize = 16;
/** Base leading (line height) without unit. */
const leading = 1.6;

const toRem = (size, base = baseSize) => `${size / base}rem`;

/*
OUTER CONFIGURATION
======================
We configure some things with env variables for now, until/if
https://github.com/tailwindcss/tailwindcss/issues/1259 resolves so we can pass
a config object to the Tailwind PostCSS config instead.
*/

// Only provide "real" colours here, no aliases.
// These are exposed as CSS variables on :root. See tailwind-variables.js.
const colors = {
  ...styleColors,
};

// These are made to utils, such as .text-{color}, .bg-{color}, .fill-{color}.
const colorAliases = {
  ...styleColors,
  current: 'currentColor',
  white: '#fff',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  /*
    Paths are relative to your project root, not your tailwind.config.js file, so if your tailwind.config.js file is in a custom location, you should still write your paths relative to the root of your project.
  */
  content: [
    // Source tree, with the app view code
    './src/**/*.{tsx,ts}',
    // Often imported components from our (built) lib in node_modules
    './node_modules/@lookback/component/build/**/*.js',
  ],

  theme: {
    baseSize,

    baseLeading: leading,

    colors,

    screens: {
      sm: '576px',
    },

    fontFamily: {
      sans: [
        'Inter',
        'helvetica neue',
        'helvetica',
        'ubuntu',
        'roboto',
        'noto',
        'segoe ui',
        'arial',
        'sans-serif',
      ],
      mono: ['Menlo', 'Consolas', 'Liberation Mono', 'Courier', 'monospace'],
    },

    // 1rem = 16px
    fontSize: {
      f7: toRem(12),
      f6: toRem(14),
      f5: toRem(16),
      f4: toRem(18),
      f3: toRem(22),
      f2: toRem(28),
      f1: toRem(34),
      f0: toRem(42),
    },

    spacing: () => {
      const mk = (fac) => `calc((var(--base-leading) * 1rem) ${fac})`;

      return {
        auto: 'auto',
        px: '1px',
        full: '100%',
        screen: '100vw',
        '0': 0, //           Calculated(1rem=16px)          Figma
        '1': mk('/ 4'), //   6.4px                          4
        '2': mk('/ 2'), //   12.8px                         8
        '3': mk('* 1'), //   25.6px                         16
        '4': mk('* 2'), //   51.2px                         32
        '5': mk('* 3'), //   76.8px                         48
        '6': mk('* 4'), //   102.4px                        64
        '7': mk('* 5'), //   128px                          80
        '8': mk('* 6'), //   153.6px                        96
        '9': mk('* 8'), //   204.8px                        128
        '10': mk('* 11'), // 281.6px                        176
        '11': mk('* 15'), // 384px                          240
        '12': mk('* 20'), // 512px                          320
        '13': mk('* 28'), // 716.8px                        448
        '14': mk('* 40'), // 1024px                         640
        '15': mk('* 55'), // 1408px                         880
      };
    },

    maxWidth: () => {
      const mk = (fac) => `calc((var(--base-leading) * 1rem) ${fac})`;

      return {
        none: 'none',
        px: '1px',
        full: '100%',
        screen: '100vw',
        '0': 0,
        '1': mk('/ 4'),
        '2': mk('/ 2'),
        '3': mk('* 1'),
        '4': mk('* 2'),
        '5': mk('* 3'),
        '6': mk('* 4'),
        '7': mk('* 5'),
        '8': mk('* 6'),
        '9': mk('* 8'),
        '10': mk('* 11'),
        '11': mk('* 15'),
        '12': mk('* 20'),
        '13': mk('* 28'),
        '14': mk('* 40'),
        '15': mk('* 55'),
      };
    },

    minWidth: () => {
      const mk = (fac) => `calc((var(--base-leading) * 1rem) ${fac})`;

      return {
        none: 'none',
        px: '1px',
        full: '100%',
        screen: '100vw',
        '0': 0,
        '1': mk('/ 4'),
        '2': mk('/ 2'),
        '3': mk('* 1'),
        '4': mk('* 2'),
        '5': mk('* 3'),
        '6': mk('* 4'),
        '7': mk('* 5'),
        '8': mk('* 6'),
        '9': mk('* 8'),
        '10': mk('* 11'),
        '11': mk('* 15'),
        '12': mk('* 20'),
        '13': mk('* 28'),
        '14': mk('* 40'),
        '15': mk('* 55'),
      };
    },

    fontWeight: {
      normal: 400,
      bold: 700,
    },

    lineHeight: {
      none: 1,
      tight: 1.45,
      normal: leading,
      loose: 2,
    },

    letterSpacing: {
      tight: '-0.05em',
      heading: '-0.011em',
      normal: '-0.009em',
      huge: '0.1em',
    },

    textColor: {
      ...colorAliases,
      body: colors['blue-80'], // Body
      muted: colors['grey-80'],
      error: colors['red-70'],
      warning: colors['orange-70'],
      positive: colors['green-70'],
    },

    backgroundColor: {
      ...colorAliases,
      body: colors['grey-20'],
    },

    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    },

    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '1': '1px',
      '2': '2px',
    },

    borderColor: {
      ...colorAliases,
      /** Default border, to be used on white. */
      DEFAULT: colors['grey-60'],
      active: colors['blue-70'],
    },

    borderRadius: {
      none: '0',
      DEFAULT: '.25rem',
      sm: '.125rem',
      lg: '.625rem',
      huge: '1.25rem',
      full: '9999px',
    },

    // Generated using https://shadows.brumm.af/
    boxShadow: {
      none: 'none',

      tiny: `0px 0.6px 0.7px rgb(var(--shadow-color) / 2.3%),
  0px 1.6px 1.9px rgb(var(--shadow-color) / 2.9%),
  0px 4px 7px rgb(var(--shadow-color) / 3%)`,

      small: `0px 0.6px 0.8px rgb(var(--shadow-color) / 1.2%),
  0px 1.6px 2.2px rgb(var(--shadow-color) / 2.2%),
  0px 4px 8px rgb(var(--shadow-color) / 4%)`,

      DEFAULT: `0px 0.4px 0.9px rgb(var(--shadow-color) / 1.4%),
  0px 1px 2.4px rgb(var(--shadow-color) / 2%),
  0px 2.4px 5.7px rgb(var(--shadow-color) / 2.6%),
  0px 8px 19px rgb(var(--shadow-color) / 4%)`,

      large: `0px 0.5px 1.7px rgb(var(--shadow-color) / 2.2%),
  0px 1.2px 4.3px rgb(var(--shadow-color) / 3.1%),
  0px 2.5px 8.9px rgb(var(--shadow-color) / 3.9%),
  0px 5.1px 18.3px rgb(var(--shadow-color) / 4.8%),
  0px 14px 50px rgb(var(--shadow-color) / 7%)`,

      /** For "floating" UI elements, such as popovers. */
      huge: `0px 0.2px 2px rgb(var(--shadow-color) / 2%),
  0px 0.3px 5.3px rgb(var(--shadow-color) / 2.8%),
  0px 1px 10.8px rgb(var(--shadow-color) / 3.5%),
  0px 3.7px 21.5px rgb(var(--shadow-color) / 4.2%),
  0px 12.5px 43.8px rgb(var(--shadow-color) / 5%),
  0px 50px 80px rgb(var(--shadow-color) / 7%)`,
    },

    zIndex: {
      auto: 'auto',
      '1': 1,
      '2': 2,
      '10': 10,
      '9999': 9999,
    },

    opacity: {
      '0': '0',
      '25': '.25',
      '50': '.5',
      '80': '.8',
      '100': '1',
    },

    fill: colorAliases,

    outline: {
      DEFAULT: '2px solid var(--ring-color)',
      none: '2px solid transparent',
    },

    stroke: {
      current: 'currentColor',
    },

    ringWidth: {
      DEFAULT: '2px',
      2: '3px',
    },

    ringOffsetWidth: {
      0: '0px',
      1: '1px',
      2: '2px',
    },

    ringOffsetColor: {
      bg: 'var(--background-color)',
      white: 'white',
    },

    extend: {
      width: {
        'max-content': 'max-content',
        'min-content': 'min-content',
      },
    },
  },
};
