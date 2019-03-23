module.exports = (conf) => {
    conf.addPassthroughCopy('site/assets');

    return {
        templateFormats: ['md', 'html', 'njk'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: 'site',
            output: 'build',
        },
    };
};
