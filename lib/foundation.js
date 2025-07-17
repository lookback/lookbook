/** A base suite of plugins all our web apps should be using. Note that the dependencies below don't live in this
 * repo: they are to be depended on in the consuming app's package.json.
 *
 * @param {Object} options
 * @param {boolean} [options.optimize=false] - If true, the CSS bundle will be optimized and minified.
 */
module.exports = ({ optimize = false } = {}) => {
  return [
    require('postcss-import')({
      resolve: patchTailwindImport,
    }),
    require('postcss-nested'),
    require('@tailwindcss/postcss')({
      optimize,
    }),
  ];
};

// When importing Tailwind modules, use require.resolve to get the correct path in the consuming app's
// node_modules. Otherwise, PostCSS will look for the modules in the *this package's* node_modules, which
// is not where the Tailwind dependency is installed.
const patchTailwindImport = (importPath, basedir) => {
  if (importPath.startsWith('tailwindcss/')) {
    return require.resolve(importPath, { paths: [process.cwd()] });
  }
  // For other imports, default behaviour applies
  return require('resolve').sync(importPath, { basedir });
};
