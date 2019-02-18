/**
 * Creates an object composed of the picked object properties.
 * @param {object} obj The source object
 * @param {string[]} paths The property paths to pick
 */
const pick = (obj, keys) => ({
    ...keys.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {}),
});

module.exports = pick;
