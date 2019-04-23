/*
    A custom cssnano like minification config for PostCSS.

    See https://github.com/cssnano/cssnano/tree/master/packages/cssnano-preset-default
*/

const defaultOpts = {
    convertValues: {
        length: false,
    },
    normalizeCharset: {
        add: false,
    },
    cssDeclarationSorter: {
        exclude: true,
    },
};

module.exports = function minify(opts = {}) {
    const options = { ...defaultOpts, ...opts };

    const plugins = [
        require('postcss-discard-comments')(options.discardComments),
        require('postcss-minify-gradients')(options.minifyGradients),
        require('postcss-reduce-initial')(options.reduceInitial),
        require('postcss-normalize-display-values')(
            options.normalizeDisplayValues
        ),
        require('postcss-reduce-transforms')(options.reduceTransforms),
        require('postcss-colormin').default(options.colormin),
        require('postcss-normalize-timing-functions')(
            options.normalizeTimingFunctions
        ),
        require('postcss-calc')(options.calc),
        require('postcss-convert-values')(options.convertValues),
        require('postcss-ordered-values')(options.orderedValues),
        require('postcss-minify-selectors')(options.minifySelectors),
        require('postcss-minify-params')(options.minifyParams),
        require('postcss-normalize-charset')(options.normalizeCharset),
        require('postcss-discard-overridden')(options.discardOverridden),
        require('postcss-normalize-string')(options.normalizeString),
        require('postcss-normalize-unicode')(options.normalizeUnicode),
        require('postcss-minify-font-values')(options.minifyFontValues),
        require('postcss-normalize-url')(options.normalizeUrl),
        require('postcss-normalize-repeat-style')(options.normalizeRepeatStyle),
        require('postcss-normalize-positions')(options.normalizePositions),
        require('postcss-normalize-whitespace')(options.normalizeWhitespace),
        require('postcss-merge-longhand')(options.mergeLonghand),
        require('postcss-discard-duplicates')(options.discardDuplicates),
        require('postcss-merge-rules')(options.mergeRules),
        require('postcss-discard-empty')(options.discardEmpty),
        require('postcss-unique-selectors')(options.uniqueSelectors),
        require('css-declaration-sorter')(options.cssDeclarationSorter),
        require('cssnano-util-raw-cache')(options.rawCache),
    ];

    return plugins;
};
