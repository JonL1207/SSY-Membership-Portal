const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");

class Skill {
    static #table = "skill";
    static #columns = ["id", "skill"];

    /**
     * Retrieves a single skill from the database based on identifier given.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database, e.g. { id: 123 }.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array} The skill searched for.
     */
    static async getSkill(identifier, connection) {
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
                throw new Error("No skill found");
            }
        } catch (err) {
            throw new Error(`Error with getSkill: ${err.message}`);
        }
    }
    
    /**
     * Gets all skills stored in database.
     *
     * @static
     * @async
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array<object>} An array of objects containing all skills.
     */
    static async getAllSkills(connection) {
        try {
            let selection = this.#columns.join(", ");

            const result = await db.read(selection, this.#table, null, null, connection);

            if (result.length > 0) {
                return result;
            } else {
                throw new Error("No skills found");
            }
        } catch (err) {
            throw new Error(`Error with getAllSkills: ${err.message}`);
        }
    }
}

module.exports = Skill;
