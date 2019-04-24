const Color = (exports.Color = {
    Green: '\x1b[32m',
    Red: '\x1b[31m',
    Reset: '\x1b[0m',
    Dim: '\x1b[2m',
    Underline: '\x1b[4m',
});

const colorize = (exports.colorize = (color, str) =>
    `${color}${str}${Color.Reset}`);

exports.link = colorize.bind(null, Color.Underline);

exports.red = colorize.bind(null, Color.Red);
exports.green = colorize.bind(null, Color.Green);
exports.dim = colorize.bind(null, Color.Dim);
