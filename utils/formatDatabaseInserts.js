const camelCaseToSnakeCase = require("./camelCaseToSnakeCase");

/**
 * Transforms data into appropriate format for insertion into database using mysql package.
 *
 * @param {object} data The data object that needs to me transformed.
 * @returns {{ columns: string; placeholders: string; values: array<string>; }} 
 */
const formatDatabaseInserts = (data) => {
    let keys = Object.keys(data);

    let columns = keys.map((key) => camelCaseToSnakeCase(key)).join(", ");
    let placeholders = keys.map(() => "?").join(", ");
    let values = keys.map((key) => data[key]);

    return { columns, placeholders, values };
};

module.exports = formatDatabaseInserts;
