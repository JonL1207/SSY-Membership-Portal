const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");
const formatDatabaseInserts = require("../utils/formatDatabaseInserts");

class Membership {
    static #table = "membership";
    static #columns = [
        "membership_number",
        "role",
        "type",
        "is_discretionary",
        "is_paying",
        "is_waiting_induction",
        "induction_status",
        "induction_method",
        "user_id",
        "stripe_id",
    ];
    
    /**
     * Generates a membership number for the user using the SSY abbriviation,
     * a random 4 digits and the current year.
     *
     * @static
     * @returns {string} The generated membership number
     */
    static #generateMembershipNumber() {
        const abbreviation = "SSY";
        const year = new Date().getFullYear().toString().slice(2);
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;

        return abbreviation.concat(randomNumber.toString(), year);
    }

    
    /**
     * Saves a users membership into the database.
     *
     * @static
     * @async
     * @param {object} newMembership The membership to be saved to the database.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message confirming the membership has been saved successfully.
     */
    static async createNewMembership(newMembership, connection) {
        try {
            if (!newMembership || Object.keys(newMembership).length === 0) {
                throw new Error("Must provide membership details");
            }

            if (!Object.keys(newMembership).includes("userId")) {
                throw new Error("Membership must include a userId");
            }

            newMembership.membershipNumber = this.#generateMembershipNumber();

            let selection = this.#columns.join(", ");
            let id = camelCaseToSnakeCase(this.#columns[0]);
            let values = [newMembership.membershipNumber];
            let existingMembershipNo = await db.read(selection, this.#table, id, values, connection);

            // Generate new membership number if membership number already exists
            while (existingMembershipNo.length > 0) {
                newMembership.membershipNumber = this.#generateMembershipNumber();
                values = [newMembership.membershipNumber];
                existingMembershipNo = await db.read(selection, this.#table, id, values, connection);
            }

            let data = formatDatabaseInserts(newMembership);

            await db.create(this.#table, data.columns, data.placeholders, data.values, connection);

            return "Membership details successfully added";
        } catch (err) {
            throw new Error(`Error with createNewMembership: ${err.message}`);
        }
    }

    /**
     * Finds a membership from the database using a given identifier.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array} An array containing the membership retrieved from the database.
     */
    static async getMembership(identifier, connection) {
        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
            }

            let selection = this.#columns.slice(0, 9).join(", ");
            let id = camelCaseToSnakeCase(Object.keys(identifier)[0]);
            let values = Object.values(identifier);

            const result = await db.read(selection, this.#table, id, values, connection);

            if (result[0].length > 0) {
                return result[0];
            } else {
                throw new Error("No membership found");
            }
        } catch (err) {
            throw new Error(`Error with getMembership: ${err.message}`);
        }
    }

    /**
     * Updates a membeship currently in the database.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} update An object containing the updates to be done on a memberships columns e.g. { firstName: "first", lastName: "last" }.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message stating if the database has been updated or not.
     */
    static async updateMembership(identifier, update, connection) {
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
                return "Membership successfully updated";
            } else {
                throw new Error("Membership does not exist or existing data already matches update, therefore could not update");
            }
        } catch (err) {
            throw new Error(`Error with updateUser: ${err.message}`);
        }
    }
}

module.exports = Membership;
