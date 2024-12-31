const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");
const formatDatabaseInserts = require("../utils/formatDatabaseInserts");

class AdditionalDetails {
    static #table = "additional_details";
    static #columns = ["user_id", "is_based_in_scotland", "is_attending_secondary", "is_attending_ternary"];

    /**
     * Saves a users additional details into the database.
     *
     * @static
     * @async
     * @param {object} newAdditionalDetails The additional details to be saved to the database.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message confirming the additional details have been saved successfully.
     */
    static async createNewAdditionalDetails(newAdditionalDetails, connection) {
        try {
            if (!newAdditionalDetails || Object.keys(newAdditionalDetails).length === 0) {
                throw new Error("Must provide additional details");
            }

            if (!Object.keys(newAdditionalDetails).includes("userId")) {
                throw new Error("Additional details must include a userId");
            }

            let data = formatDatabaseInserts(newAdditionalDetails);

            await db.create(this.#table, data.columns, data.placeholders, data.values, connection);

            return "Additional details added successfully";
        } catch (err) {
            throw new Error(`Error with createNewAdditionalDetails: ${err.message}`);
        }
    }

    /**
     * Finds additional details from the database using a given identifier.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {user_id: 123}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array} An array containing the additional details retrieved from the database.
     */
    static async getAdditionalDetails(identifier, connection) {
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
                throw new Error("No additional details found");
            }
        } catch (err) {
            throw new Error(`Error with getAdditionalDetails: ${err.message}`);
        }
    }

    /**
     * Updates additional details in the database.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {user_id: 123}.
     * @param {object} update An object containing the fields to update in the database e.g. {isBasedInScotland: true}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message confirming the additional details have been updated successfully.
     */
    static async updateAdditionalDetails(identifier, update, connection) {
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
                return "Additional details updated successfully";
            } else {
                throw new Error("Additional details does not exist or existing data already matches update, therefore could not update");
            }
        } catch (err) {
            throw new Error(`Error with updateAdditionalDetails: ${err.message}`);
        }
    }
}

module.exports = AdditionalDetails;
