const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");
const formatDatabaseInserts = require("../utils/formatDatabaseInserts");

class ExternalMemberships {
    static #table = "external_memberships";
    static #columns = ["id", "name", "type, user_id"];
    static #schema = {};

    /**
     * Gets the schema to validate external membership data.
     *
     * @static
     * @returns {object} Schema to be used for validation.
     */
    static getExtenalMembershipSchema() {
        return this.#schema;
    }

    /**
     * Saves a new external membership into the database.
     *
     * @static
     * @async
     * @param {object} newExtMembership The external membership to be saved to the database.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message confirming the external membership has been saved successfully.
     */
    static async createNewExternalMembership(newExtMembership, connection) {
        try {
            if (!newExtMembership || Object.keys(newExtMembership).length === 0) {
                throw new Error("Must provide external membership details");
            }

            if (!Object.keys(newExtMembership).includes("userId")) {
                throw new Error("External membership must include a userId");
            }

            let data = formatDatabaseInserts(newExtMembership);

            await db.create(this.#table, data.columns, data.placeholders, data.values, connection);

            return "External membership added successfully";
        } catch (err) {
            throw new Error(`Error with createNewExternalMembership: ${err.message}`);
        }
    }

    /**
     * Finds an external membership from the database using a given identifier.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {name: 'name'}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array} An array containing the external membership retrieved from the database.
     */
    static async getExtenalMembership(identifier, connection) {
        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
            }

            let selection = this.#columns.join(", ");
            let id = camelCaseToSnakeCase(Object.keys(identifier)[0]);
            let values = Object.values(identifier);

            const result = await db.read(selection, this.#table, id, values, connection);

            if (result[0].length > 0) {
                return result[0];
            } else {
                throw new Error("No external membership found");
            }
        } catch (err) {
            throw new Error(`Error with getExtenalMembership: ${err.message}`);
        }
    }

    /**
     * Updates an external membership in the database.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {name: 'name'}.
     * @param {object} update An object containing the fields to update in the database e.g. {name: 'new name'}.
     * @param {object} connection An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message confirming the external membership has been updated successfully.
     */
    static async updateExternalMembership(identifier, update, connection) {
        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
            }

            if (!update || Object.keys(update).length === 0) {
                throw new Error("Must provide an update");
            }

            let updateColumns =
                Object.keys(update)
                    .map((key) => camelCaseToSnakeCase(key))
                    .join(" = ?, ") + " = ?";

            let id = camelCaseToSnakeCase(Object.keys(identifier)[0]);

            let values = Object.values(update);
            values.push(Object.values(identifier)[0]);

            const result = await db.update(this.#table, updateColumns, id, values, connection);

            if (result.changedRows) {
                return "External membership updated successfully";
            } else {
                throw new Error("External membership does not exist or existing data already matches update, therefore could not update");
            }
        } catch (err) {
            throw new Error(`Error with updateExternalMembership: ${err.message}`);
        }
    }
}

module.exports = ExternalMemberships;
