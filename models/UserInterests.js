const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");
const formatDatabaseInserts = require("../utils/formatDatabaseInserts");
const User = require("./User");
const Interest = require("./Interest");
const Database = require("../config/Database");

class UserInterests {
    static #table = "interest_skills";
    static #columns = ["user_id", "interest_id"];

    /**
     * Saves a new user interest into the database using the ID from the user and the ID from the interest.
     *
     * @static
     * @async
     * @param {object} newUserInterest Object containing the ID of the correct user and the ID of their correspinding interest.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} Success message.
     */
    static async createNewUserInterest(newUserInterest, connection) {
        try {
            if (!newUserInterest || Object.keys(newUserInterest).length < 2 || Object.keys(newUserInterest).length > 2) {
                throw new Error("Must provide a user id and a interest id only");
            }

            if (!Object.keys(newUserInterest).includes("userId") || !Object.keys(newUserInterest).includes("interestId")) {
                throw new Error("The user skill must have a 'userId' and a 'interestId'");
            }

            await User.getUser({ id: newUserInterest.userId });
            await Interest.getInterest({ id: newUserInterest.interestId });

            let data = formatDatabaseInserts(newUserInterest);

            await db.create(this.#table, data.columns, data.placeholders, data.values, connection);

            return "User interest added successfully";
        } catch (err) {
            throw new Error(`Error with createNewUserInterest: ${err.message}`);
        }
    }

    /**
     * Gets a list of interests that a user has or gets a list of users' that have an interest based
     * on the identifier parameter that is provided, 'userId' for the list of interests or
     * 'interestId' for the list of users.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} connection An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array<object>} An array containing the specified users' skills or all users that have a specified skill.
     */
    static async getUserInterests(identifier, connection) {
        let conn;
        let selection;
        let id;
        let sql;
        let values;

        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
            }

            if (!Object.keys(identifier)[0] === "userId" || !Object.keys(identifier)[0] === "interestId") {
                throw new Error("Identifier must either be 'userId' or 'interestId'");
            }

            if (Object.keys(identifier)[0] === "userId") {
                selection = "interest.interest";
                id = "user.id";
            } else if (Object.keys(identifier)[0] === "interestId") {
                selection = "user.first_name, user.last_name";
                id = "interest.id";
            }

            sql = `SELECT ${selection} FROM ${this.#table} JOIN user ON ${this.#table}.${this.#columns[0]} = user.id JOIN interest ON ${this.#table}.${
                this.#columns[1]
            } = interest.id WHERE ${id} = ?`;

            values = Object.values(identifier);

            conn = connection ? connection : await Database.getPool().getConnection();
            const [result] = await conn.execute(sql, values);

            if (!result[0].length > 0) {
                throw new Error("No user interests found");
            }

            return result;
        } catch (err) {
            throw new Error(`Error with getUserInterests: ${err.message}`);
        } finally {
            if (conn) conn.release();
        }
    }

    /**
     * Deletes a specified user interest.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique values to look up in the database, e.g. {userId: 1, interestId: 1}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message stating if the user skill has been deleted or not.
     */
    static async deleteUserInterest(identifier, connection) {
        try {
            if (!identifier || Object.keys(identifier).length < 2 || Object.keys(identifier).length > 2) {
                throw new Error("Must only provide both the 'userId' and the 'interestId'");
            }

            let id1 = camelCaseToSnakeCase(Object.keys(identifier)[0]);
            let id2 = camelCaseToSnakeCase(Object.keys(identifier)[1]);
            let values = Object.values(identifier);

            let sql = `DELETE FROM ${this.#table} WHERE ${id1} = ? AND ${id2} = ?`;

            const result = await db.delete(null, null, values, connection, sql);

            if (result.affectedRows) {
                return "User interest successfully deleted";
            } else {
                throw new Error("Could not find user interest to delete");
            }
        } catch (err) {
            throw new Error(`Error with deleteUserInterest: ${err.message}`);
        }
    }
}

module.exports = UserInterests;
