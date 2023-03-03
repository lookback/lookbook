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

const USE_P3_COLORS = !!process.env.LOOKBOOK_USE_P3 || false;

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

module.exports = {
  purge: {
    enabled: false,
  },

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

    negativeMargin: () => {
      const mk = (fac) => `calc((var(--base-leading) * 1rem) ${fac})`;

      return {
        auto: 'auto',
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
        '9': mk('* 7'),
        '10': mk('* 10'),
        '11': mk('* 15'),
        '12': mk('* 22'),
        '13': mk('* 30'),
        '14': mk('* 40'),
        '15': mk('* 52'),
      };
    },

    spacing: () => {
      const mk = (fac) => `calc((var(--base-leading) * 1rem) ${fac})`;

      return {
        auto: 'auto',
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
        '9': mk('* 7'),
        '10': mk('* 10'),
        '11': mk('* 15'),
        '12': mk('* 22'),
        '13': mk('* 30'),
        '14': mk('* 40'),
        '15': mk('* 52'),
      };
    },

    maxWidth: () => {
      const mk = (fac) => `calc((var(--base-leading) * 1rem) ${fac})`;

      return {
        auto: 'auto',
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
        '9': mk('* 7'),
        '10': mk('* 10'),
        '11': mk('* 15'),
        '12': mk('* 22'),
        '13': mk('* 30'),
        '14': mk('* 40'),
        '15': mk('* 52'),
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
      '2': '2px',
    },

    borderColor: {
      ...colorAliases,
      /** Default border, to be used on white. */
      DEFAULT: colors['grey-40'],
      active: colors['blue-50'],
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

      tiny: `0px 0.6px 0.7px rgba(0, 0, 0, 0.023),
  0px 1.6px 1.9px rgba(0, 0, 0, 0.029),
  0px 4px 7px rgba(0, 0, 0, 0.03)`,

      small: `0px 0.6px 0.8px rgba(0, 0, 0, 0.012),
  0px 1.6px 2.2px rgba(0, 0, 0, 0.022),
  0px 4px 8px rgba(0, 0, 0, 0.04)`,

      DEFAULT: `0px 0.4px 0.9px rgba(0, 0, 0, 0.014),
  0px 1px 2.4px rgba(0, 0, 0, 0.02),
  0px 2.4px 5.7px rgba(0, 0, 0, 0.026),
  0px 8px 19px rgba(0, 0, 0, 0.04)`,

      large: `0px 0.3px 1.2px rgba(0, 0, 0, 0.012),
  0px 0.9px 3px rgba(0, 0, 0, 0.018),
  0px 1.8px 6.2px rgba(0, 0, 0, 0.022),
  0px 3.7px 12.8px rgba(0, 0, 0, 0.028),
  0px 10px 35px rgba(0, 0, 0, 0.04)`,
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

  variants: {
    accessibility: [],
    backgroundColor: ['dark'],
    borderColor: [],
    borderRadius: [],
    borderStyle: [],
    borderWidth: [],
    cursor: [],
    display: ['responsive'],
    flexDirection: ['responsive'],
    alignItems: [],
    alignSelf: [],
    gap: [],
    justifyContent: [],
    flex: [],
    flexGrow: [],
    flexShrink: [],
    flexWrap: [],
    fontFamily: [],
    fontWeight: [],
    lineHeight: [],
    listStyleType: [],
    margin: [],
    maxWidth: [],
    opacity: ['hover', 'focus'],
    overflow: [],
    padding: [],
    position: [],
    inset: [],
    boxShadow: [],
    fill: [],
    textAlign: [],
    textColor: [],
    fontSize: ['responsive'],
    fontStyle: [],
    textTransform: [],
    textOverflow: [],
    textDecoration: ['hover'],
    fontSmoothing: [],
    letterSpacing: [],
    userSelect: [],
    verticalAlign: [],
    visibility: ['responsive'],
    whitespace: [],
    wordBreak: [],
    width: ['responsive'],
    maxHeight: [],
    minHeight: [],
    height: [],
    zIndex: [],
    fontVariantNumeric: [],
    pointerEvents: [],
    ringWidth: ['focus', 'focus-visible'],
    ringColor: ['focus', 'focus-visible'],
    ringOffsetWidth: ['focus', 'focus-visible'],
    ringOffsetColor: ['focus', 'focus-visible'],
    ringOpacity: ['focus', 'focus-visible'],
  },

  corePlugins: {
    animation: false,
    backgroundImage: false,
    backgroundClip: false,
    backgroundAttachment: false,
    backgroundPosition: false,
    backgroundRepeat: false,
    backgroundSize: false,
    borderOpacity: false,
    boxSizing: false,
    container: false,
    clear: false,
    divideWidth: false,
    divideColor: false,
    divideOpacity: false,
    divideStyle: false,
    appearance: false,
    borderCollapse: false,
    alignContent: false,
    gradientColorStops: false,
    gridAutoColumns: false,
    gridAutoRows: false,
    gridTemplateColumns: false,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,
    gridTemplateRows: false,
    gridRow: false,
    gridRowStart: false,
    gridAutoFlow: false,
    gridRowEnd: false,
    float: false,
    listStylePosition: false,
    negativeMargin: false,
    placeholderColor: false,
    resize: false,
    stroke: false,
    strokeWidth: false,
    space: false,
    scale: false,
    rotate: false,
    translate: false,
    skew: false,
    transformOrigin: false,
    transform: false,
    tableLayout: false,
    transitionProperty: false,
    transitionDuration: false,
    transitionTimingFunction: false,
    transitionDelay: false,
    order: false,
    objectPosition: false,
    objectFit: false,
    overscrollBehavior: false,
    placeSelf: false,
    placeholderOpacity: false,
  },

  plugins: [
    // Use all colors from Figma as CSS variable on the :root element
    require('./lib/plugins/tailwind-variables')({
      useP3: USE_P3_COLORS,
    }),
  ],
};
