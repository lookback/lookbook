module.exports = (ctx) => ({
    map: 'inline', // Sourcemaps
    plugins: {
        'postcss-import': {},
        tailwindcss: 'tailwind.js',
        'postcss-mixins': {},
        'postcss-simple-vars': {},
        'postcss-nested': {},
        'postcss-color-function': {},
        autoprefixer: {},
        'postcss-hexrgba': {},
        cssnano: ctx.env === 'production' ? { preset: 'default' } : false,
    },
});
