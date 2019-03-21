const postcss = require('postcss');

module.exports = function(prefix = 'dark') {
    return function({ addVariant, e }) {
        addVariant('dark', ({ container, separator }) => {
            const supportsRule = postcss.atRule({
                name: 'media',
                params: 'screen and (prefers-color-scheme: dark)',
            });

            supportsRule.nodes = container.nodes;
            container.nodes = [supportsRule];

            supportsRule.walkRules((rule) => {
                rule.selector = `.${e(
                    `${prefix}${separator}${rule.selector}`
                )}`;
            });
        });
    };
};
