const pick = require('./lib/pick');
const styleColors = require('./colors.json');

/** Root font size without unit. */
const baseSize = 16;
/** Base leading (line height) without unit. */
const leading = 1.5;

const toRem = (size, base = baseSize) => `${size / base}rem`;

/*
OUTER CONFIGURATION
======================
We configure some things with env variables for now, until/if
https://github.com/tailwindcss/tailwindcss/issues/1259 resolves so we can pass
a config object to the Tailwind PostCSS config instead.
*/

const USE_P3_COLORS = !!process.env.LOOKBOOK_USE_P3 || false;

/*

Lookbook – the design system of Lookback

Built with Tailwind - The Utility-First CSS Framework. View the full documentation at https://tailwindcss.com.

|--- TABLE OF CONTENTS ---|

* Options
* Color settings
* Screens
* Fonts
* Text sizes
* Font weights
* Leading
* Tracking
* Text colors
* Background colors
* Background sizes
* Border widths
* Border colors
* Border radius
* Width
* Height
* Min width
* Min height
* Max width
* Max height
* Padding
* Margin
* Negative margin
* Shadows
* Z-index
* Opacity
* SVG fill
* SVG stroke
* Variants
* Plugins

|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// let defaultConfig = require('tailwindcss/defaultConfig')

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
| This is a pretty nice resource for naming a colour from a hex code:
|
| http://chir.ag/projects/name-that-color
*/
const colors = {
  ...styleColors,
  'off-white': '#fefefe',
  white: '#fff',
  transparent: 'transparent',
  defaultBoxShadow: '#006693',
};

module.exports = {
  purge: {
    enabled: false,
  },

  theme: {
    baseSize,

    baseLeading: leading,

    /*
        |-----------------------------------------------------------------------------
        | Colors                                  https://tailwindcss.com/docs/colors
        |-----------------------------------------------------------------------------
        |
        | The color palette defined above is also assigned to the "colors" key of
        | your Tailwind config. This makes it easy to access them in your CSS
        | using Tailwind's config helper. For example:
        |
        | .error { color: theme('colors.red') }
        |
    */

    colors,

    /*
        |-----------------------------------------------------------------------------
        | Screens                      https://tailwindcss.com/docs/responsive-design
        |-----------------------------------------------------------------------------
        |
        | Screens in Tailwind are translated to CSS media queries. They define the
        | responsive breakpoints for your project. By default Tailwind takes a
        | "mobile first" approach, where each screen size represents a minimum
        | viewport width. Feel free to have as few or as many screens as you
        | want, naming them in whatever way you'd prefer for your project.
        |
        | Tailwind also allows for more complex screen definitions, which can be
        | useful in certain situations. Be sure to see the full responsive
        | documentation for a complete list of options.
        |
        | Class name: .{screen}:{utility}
        |
    */

    screens: {
      sm: '576px',
    },

    /*
        |-----------------------------------------------------------------------------
        | Fonts                                    https://tailwindcss.com/docs/fonts
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your project's font stack, or font families.
        | Keep in mind that Tailwind doesn't actually load any fonts for you.
        | If you're using custom fonts you'll need to import them prior to
        | defining them here.
        |
        | By default we provide a native font stack that works remarkably well on
        | any device or OS you're using, since it just uses the default fonts
        | provided by the platform.
        |
        | Class name: .font-{name}
        |
    */

    fontFamily: {
      sans: [
        'Lato',
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

    /*
        |-----------------------------------------------------------------------------
        | Text sizes                         https://tailwindcss.com/docs/text-sizing
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your text sizes. Name these in whatever way
        | makes the most sense to you. We use size names by default, but
        | you're welcome to use a numeric scale or even something else
        | entirely.
        |
        | By default Tailwind uses the "rem" unit type for most measurements.
        | This allows you to set a root font size which all other sizes are
        | then based on. That said, you are free to use whatever units you
        | prefer, be it rems, ems, pixels or other.
        |
        | Class name: .text-{size}
        |
    */

    fontSize: {
      f7: toRem(12),
      f6: toRem(14),
      f5: toRem(16),
      f4: toRem(18),
      f3: toRem(22),
      f2: toRem(28),
      f1: toRem(42),
      f0: toRem(54),
    },

    /*
        |-----------------------------------------------------------------------------
        | Padding                                https://tailwindcss.com/docs/padding
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your padding utility sizes. These can be
        | percentage based, pixels, rems, or any other units. By default we
        | provide a sensible rem based numeric scale plus a couple other
        | common use-cases like "1px". You can, of course, modify these
        | values as needed.
        |
        | Class name: .p{side?}-{size}
        |
        */

    padding: {
      px: '1px',
      '0': 0,
      '1': `${leading / 4}rem`,
      '2': `${leading / 2}rem`,
      '3': `${leading * 1}rem`,
      '4': `${leading * 2}rem`,
      '5': `${leading * 3}rem`,
      '6': `${leading * 4}rem`,
      '7': `${leading * 5}rem`,
      '8': `${leading * 6}rem`,
      '9': `${leading * 7}rem`,
    },

    /*
        |-----------------------------------------------------------------------------
        | Margin                                  https://tailwindcss.com/docs/margin
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your margin utility sizes. These can be
        | percentage based, pixels, rems, or any other units. By default we
        | provide a sensible rem based numeric scale plus a couple other
        | common use-cases like "1px". You can, of course, modify these
        | values as needed.
        |
        | Class name: .m{side?}-{size}
        |
        */

    margin: {
      auto: 'auto',
      px: '1px',
      '0': 0,
      '1': `${leading / 4}rem`,
      '2': `${leading / 2}rem`,
      '3': `${leading * 1}rem`,
      '4': `${leading * 2}rem`,
      '5': `${leading * 3}rem`,
      '6': `${leading * 4}rem`,
      '7': `${leading * 5}rem`,
      '8': `${leading * 6}rem`,
      '9': `${leading * 7}rem`,
    },

    /*
        |-----------------------------------------------------------------------------
        | Negative margin                https://tailwindcss.com/docs/negative-margin
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your negative margin utility sizes. These can
        | be percentage based, pixels, rems, or any other units. By default we
        | provide matching values to the padding scale since these utilities
        | generally get used together. You can, of course, modify these
        | values as needed.
        |
        | Class name: .-m{side?}-{size}
        |
        */

    negativeMargin: {
      px: '1px',
      '0': '0',
      '1': `${leading / 4}rem`,
      '2': `${leading / 2}rem`,
      '3': `${leading * 1}rem`,
      '4': `${leading * 2}rem`,
      '5': `${leading * 3}rem`,
      '6': `${leading * 4}rem`,
      '7': `${leading * 5}rem`,
      '8': `${leading * 6}rem`,
      '9': `${leading * 7}rem`,
    },

    /*
        |-----------------------------------------------------------------------------
        | Font weights                       https://tailwindcss.com/docs/font-weight
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your font weights. We've provided a list of
        | common font weight names with their respective numeric scale values
        | to get you started. It's unlikely that your project will require
        | all of these, so we recommend removing those you don't need.
        |
        | Class name: .font-{weight}
        |
    */

    fontWeight: {
      light: 300,
      normal: 400,
      bold: 700,
      black: 900,
    },

    /*
        |-----------------------------------------------------------------------------
        | Leading (line height)              https://tailwindcss.com/docs/line-height
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your line height values, or as we call
        | them in Tailwind, leadings.
        |
        | Class name: .leading-{size}
        |
    */

    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: leading,
      loose: 2,
    },

    /*
        |-----------------------------------------------------------------------------
        | Tracking (letter spacing)       https://tailwindcss.com/docs/letter-spacing
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your letter spacing values, or as we call
        | them in Tailwind, tracking.
        |
        | Class name: .tracking-{size}
        |
    */

    letterSpacing: {
      tight: '-0.05em',
      normal: '0',
      wide: '0.05em',
      huge: '0.1em',
    },

    /*
        |-----------------------------------------------------------------------------
        | Text colors                         https://tailwindcss.com/docs/text-color
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your text colors. By default these use the
        | color palette we defined above, however you're welcome to set these
        | independently if that makes sense for your project.
        |
        | Class name: .text-{color}
        |
    */

    textColor: {
      DEFAULT: colors['blue-80'], // Body
      ...pick(colors, [
        'white',
        'blue-60', // Main brand
        'blue-70', // Saturated
        'grey-60', // Muted
        'green-60',
        'green-50',
      ]),
      error: colors['red-60'],
      warning: colors['orange-60'],
      positive: colors['green-60'],
    },

    /*
        |-----------------------------------------------------------------------------
        | Background colors             https://tailwindcss.com/docs/background-color
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your background colors. By default these use
        | the color palette we defined above, however you're welcome to set
        | these independently if that makes sense for your project.
        |
        | Class name: .bg-{color}
        |
    */

    backgroundColor: {
      DEFAULT: colors['blue-10'],
      ...pick(colors, [
        'grey-10',
        'white',
        'blue-80',
        'red-60',
        'green-10',
        'green-50',
        'green-60',
      ]),
    },

    /*
        |-----------------------------------------------------------------------------
        | Background sizes               https://tailwindcss.com/docs/background-size
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your background sizes. We provide some common
        | values that are useful in most projects, but feel free to add other sizes
        | that are specific to your project here as well.
        |
        | Class name: .bg-{size}
        |
    */

    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    },

    /*
        |-----------------------------------------------------------------------------
        | Border widths                     https://tailwindcss.com/docs/border-width
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your border widths. Take note that border
        | widths require a special "default" value set as well. This is the
        | width that will be used when you do not specify a border width.
        |
        | Class name: .border{-side?}{-width?}
        |
    */

    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
    },

    /*
        |-----------------------------------------------------------------------------
        | Border colors                     https://tailwindcss.com/docs/border-color
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your border colors. By default these use the
        | color palette we defined above, however you're welcome to set these
        | independently if that makes sense for your project.
        |
        | Take note that border colors require a special "default" value set
        | as well. This is the color that will be used when you do not
        | specify a border color.
        |
        | Class name: .border-{color}
        |
    */

    borderColor: {
      /** Default border, to be used on white. */
      DEFAULT: colors['grey-30'],
      /** To be used on light blue backgrounds. */
      light: '#D4E8F5',
    },

    /*
        |-----------------------------------------------------------------------------
        | Border radius                    https://tailwindcss.com/docs/border-radius
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your border radius values. If a `default` radius
        | is provided, it will be made available as the non-suffixed `.rounded`
        | utility.
        |
        | If your scale includes a `0` value to reset already rounded corners, it's
        | a good idea to put it first so other values are able to override it.
        |
        | Class name: .rounded{-side?}{-size?}
        |
    */

    borderRadius: {
      none: '0',
      DEFAULT: '.25rem',
      sm: '.125rem',
      lg: '.5rem',
      huge: '20px',
      full: '9999px',
    },

    /*
        |-----------------------------------------------------------------------------
        | Width                                    https://tailwindcss.com/docs/width
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your width utility sizes. These can be
        | percentage based, pixels, rems, or any other units. By default
        | we provide a sensible rem based numeric scale, a percentage
        | based fraction scale, plus some other common use-cases. You
        | can, of course, modify these values as needed.
        |
        |
        | It's also worth mentioning that Tailwind automatically escapes
        | invalid CSS class name characters, which allows you to have
        | awesome classes like .w-2/3.
        |
        | Class name: .w-{size}
        |
    */

    width: {
      auto: 'auto',
      px: '1px',
      '1': '1rem',
      '2': '2rem',
      '3': '4rem',
      '4': '6rem',
      '5': '8rem',
      '6': '12rem',
      '7': '16rem',
      '8': '24rem',
      '9': '32rem',
      '10': '48rem',
      full: '100%',
      screen: '100vw',
    },

    /*
        |-----------------------------------------------------------------------------
        | Maximum width                        https://tailwindcss.com/docs/max-width
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your maximum width utility sizes. These can
        | be percentage based, pixels, rems, or any other units. By default
        | we provide a sensible rem based scale and a "full width" size,
        | which is basically a reset utility. You can, of course,
        | modify these values as needed.
        |
        | Class name: .max-w-{size}
        |
        */

    maxWidth: {
      '0': 'none',
      '1': '1rem',
      '2': '2rem',
      '3': '4rem',
      '4': '6rem',
      '5': '8rem',
      '6': '12rem',
      '7': '16rem',
      '8': '24rem',
      '9': '32rem',
      '10': '48rem',
      full: '100%',
    },

    /*
        |-----------------------------------------------------------------------------
        | Height                                  https://tailwindcss.com/docs/height
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your height utility sizes. These can be
        | percentage based, pixels, rems, or any other units. By default
        | we provide a sensible rem based numeric scale plus some other
        | common use-cases. You can, of course, modify these values as
        | needed.
        |
        | Class name: .h-{size}
        |
    */

    height: {
      auto: 'auto',
      full: '100%',
      screen: '100vh',
    },

    inset: {
      '0': 0,
      auto: 'auto',
    },

    /*
        |-----------------------------------------------------------------------------
        | Minimum width                        https://tailwindcss.com/docs/min-width
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your minimum width utility sizes. These can
        | be percentage based, pixels, rems, or any other units. We provide a
        | couple common use-cases by default. You can, of course, modify
        | these values as needed.
        |
        | Class name: .min-w-{size}
        |
    */

    minWidth: {
      '0': '0',
      full: '100%',
    },

    /*
        |-----------------------------------------------------------------------------
        | Minimum height                      https://tailwindcss.com/docs/min-height
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your minimum height utility sizes. These can
        | be percentage based, pixels, rems, or any other units. We provide a
        | few common use-cases by default. You can, of course, modify these
        | values as needed.
        |
        | Class name: .min-h-{size}
        |
    */

    minHeight: {
      '0': '0',
      full: '100%',
      screen: '100vh',
    },

    /*
        |-----------------------------------------------------------------------------
        | Maximum height                      https://tailwindcss.com/docs/max-height
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your maximum height utility sizes. These can
        | be percentage based, pixels, rems, or any other units. We provide a
        | couple common use-cases by default. You can, of course, modify
        | these values as needed.
        |
        | Class name: .max-h-{size}
        |
    */

    maxHeight: {
      full: '100%',
      screen: '100vh',
    },

    /*
        |-----------------------------------------------------------------------------
        | Shadows                                https://tailwindcss.com/docs/shadows
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your shadow utilities. As you can see from
        | the defaults we provide, it's possible to apply multiple shadows
        | per utility using comma separation.
        |
        | If a `default` shadow is provided, it will be made available as the non-
        | suffixed `.shadow` utility.
        |
        | Class name: .shadow-{size?}
        |
    */

    boxShadow: (theme) => ({
      DEFAULT: `0px 3px 20px rgba(${theme('colors.defaultBoxShadow')}, .15)`,
      large: `0px 10px 40px rgba(${theme('colors.defaultBoxShadow')}, .2)`,
      small: `0px 2px 10px rgba(${theme('colors.defaultBoxShadow')}, .1)`,
      tiny: `0 1px 3px rgba(${theme('colors.defaultBoxShadow')}, .4)`,
      none: 'none',
    }),

    /*
        |-----------------------------------------------------------------------------
        | Z-index                                https://tailwindcss.com/docs/z-index
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your z-index utility values. By default we
        | provide a sensible numeric scale. You can, of course, modify these
        | values as needed.
        |
        | Class name: .z-{index}
        |
    */

    zIndex: {
      auto: 'auto',
      '1': 1,
      '2': 2,
      '10': 10,
      '9999': 9999,
    },

    /*
        |-----------------------------------------------------------------------------
        | Opacity                                https://tailwindcss.com/docs/opacity
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your opacity utility values. By default we
        | provide a sensible numeric scale. You can, of course, modify these
        | values as needed.
        |
        | Class name: .opacity-{name}
        |
    */

    opacity: {
      '0': '0',
      '25': '.25',
      '50': '.5',
      '80': '.8',
      '100': '1',
    },

    /*
        |-----------------------------------------------------------------------------
        | SVG fill                                   https://tailwindcss.com/docs/svg
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your SVG fill colors. By default we just provide
        | `fill-current` which sets the fill to the current text color. This lets you
        | specify a fill color using existing text color utilities and helps keep the
        | generated CSS file size down.
        |
        | Class name: .fill-{name}
        |
    */

    fill: (theme) => ({
      current: 'currentColor',
      danger: theme('colors.red-50'),
      warning: theme('colors.orange-50'),
      positive: theme('colors.green-50'),
    }),

    /*
        |-----------------------------------------------------------------------------
        | SVG stroke                                 https://tailwindcss.com/docs/svg
        |-----------------------------------------------------------------------------
        |
        | Here is where you define your SVG stroke colors. By default we just provide
        | `stroke-current` which sets the stroke to the current text color. This lets
        | you specify a stroke color using existing text color utilities and helps
        | keep the generated CSS file size down.
        |
        | Class name: .stroke-{name}
        |
    */

    stroke: {
      current: 'currentColor',
    },
  },

  /*
    |-----------------------------------------------------------------------------
    | Variants                  https://tailwindcss.com/docs/configuration#modules
    |-----------------------------------------------------------------------------
    |
    | Here is where you control which modules are generated and what variants are
    | generated for each of those modules.
    |
    | Currently supported variants:
    |   - responsive
    |   - hover
    |   - focus
    |   - active
    |   - group-hover
    |
    | To disable a module completely, use `false` instead of an array.
    |
  */

  variants: {
    appearance: false,
    accessibility: [],
    backgroundAttachment: false,
    backgroundColor: ['dark'],
    backgroundPosition: false,
    backgroundRepeat: false,
    backgroundSize: false,
    borderCollapse: false,
    borderColor: [],
    borderRadius: [],
    borderStyle: [],
    borderWidth: [],
    boxSizing: false,
    cursor: [],
    display: ['responsive'],
    flexDirection: ['responsive'],
    alignItems: [],
    alignSelf: [],
    justifyContent: [],
    alignContent: false,
    flex: [],
    flexGrow: [],
    flexShrink: [],
    flexWrap: [],
    float: false,
    fontFamily: [],
    fontWeight: [],
    height: false,
    lineHeight: [],
    listStylePosition: false,
    listStyleType: [],
    margin: [],
    maxHeight: false,
    maxWidth: [],
    minHeight: false,
    minWidth: false,
    negativeMargin: false,
    opacity: ['hover', 'focus'],
    outline: false,
    overflow: [],
    padding: [],
    pointerEvents: false,
    position: [],
    inset: [],
    resize: false,
    boxShadow: [],
    fill: [],
    stroke: false,
    tableLayout: false,
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
    zIndex: [],
  },

  corePlugins: {
    animation: false,
    backgroundOpacity: false,
    borderOpacity: false,
    container: false,
    clear: false,
    divideWidth: false,
    divideColor: false,
    divideOpacity: false,
    appearance: false,
    backgroundAttachment: false,
    backgroundPosition: false,
    backgroundRepeat: false,
    backgroundSize: false,
    borderCollapse: false,
    alignContent: false,
    gridTemplateColumns: false,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,
    gridTemplateRows: false,
    gridRow: false,
    gridRowStart: false,
    gap: false,
    gridAutoFlow: false,
    gridRowEnd: false,
    float: false,
    height: false,
    listStylePosition: false,
    maxHeight: false,
    minWidth: false,
    negativeMargin: false,
    outline: false,
    placeholderColor: false,
    pointerEvents: false,
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
    placeholderOpacity: false,
    textOpacity: false,
  },

  /*
    |-----------------------------------------------------------------------------
    | Plugins                                https://tailwindcss.com/docs/plugins
    |-----------------------------------------------------------------------------
    |
    | Here is where you can register any plugins you'd like to use in your
    | project. Tailwind's built-in `container` plugin is enabled by default to
    | give you a Bootstrap-style responsive container component out of the box.
    |
    | Be sure to view the complete plugin documentation to learn more about how
    | the plugin system works.
    |
  */

  plugins: [
    // Use all colors from Figma as CSS variable on the :root element
    require('./lib/plugins/tailwind-variables')({
      useP3: USE_P3_COLORS,
    }),
  ],
};
