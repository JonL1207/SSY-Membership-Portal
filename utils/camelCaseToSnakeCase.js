/**
 * Transforms a string in camel casing to a string in snake casing.
 *
 * @param {string} str A string in camel casing.
 * @returns {string} The string in snake casing.
 */
const camelToSnakeCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};

module.exports = camelToSnakeCase;
