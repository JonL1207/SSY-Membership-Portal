const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");
const formatDatabaseInserts = require("../utils/formatDatabaseInserts");
const User = require("./User");
const Skill = require("./Skill");
const Database = require("../config/Database");

class UserSkills {
    static #table = "user_skills";
    static #columns = ["user_id", "skill_id"];

    /**
     * Saves a new user skill into the database using the ID from the user and the ID from the skill.
     *
     * @static
     * @async
     * @param {object} newUserSkill Object containing the ID of the correct user and the ID of their correspinding skill.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} Success message.
     */
    static async createNewUserSkill(newUserSkill, connection) {
        try {
            if (!newUserSkill || Object.keys(newUserSkill).length < 2 || Object.keys(newUserSkill).length > 2) {
                throw new Error("Must provide a user id and a skill id only");
            }

            if (!Object.keys(newUserSkill).includes("userId") || !Object.keys(newUserSkill).includes("skillId")) {
                throw new Error("The user skill must have a 'userId' and a 'skillId'");
            }

            await User.getUser({ id: newUserSkill.userId });
            await Skill.getSkill({ id: newUserSkill.skillId });

            let data = formatDatabaseInserts(newUserSkill);

            await db.create(this.#table, data.columns, data.placeholders, data.values, connection);

            return "User skill added successfully";
        } catch (err) {
            throw new Error(`Error with createNewUserSkill: ${err.message}`);
        }
    }

    /**
     * Gets a list of skills that a user has or gets a list of users' that have a skill based
     * on the identifier parameter that is provided, 'userId' for the list of skills or
     * 'skillId' for the list of users.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} connection An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array<object>} An array containing the specified users' skills or all users that have a specified skill.
     */
    static async getUserSkills(identifier, connection) {
        let conn;
        let selection;
        let id;
        let sql;
        let values;

        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
            }

            if (!Object.keys(identifier)[0] === "userId" || !Object.keys(identifier)[0] === "skillId") {
                throw new Error("Identifier must either be 'userId' or 'skillId'");
            }

            if (Object.keys(identifier)[0] === "userId") {
                selection = "skill.skill";
                id = "user.id";
            } else if (Object.keys(identifier)[0] === "skillId") {
                selection = "user.first_name, user.last_name";
                id = "skill.id";
            }

            sql = `SELECT ${selection} FROM ${this.#table} JOIN user ON ${this.#table}.${this.#columns[0]} = user.id JOIN skill ON ${this.#table}.${
                this.#columns[1]
            } = skill.id WHERE ${id} = ?`;

            values = Object.values(identifier);

            conn = connection ? connection : await Database.getPool().getConnection();
            const [result] = await conn.execute(sql, values);

            if (!result[0].length > 0) {
                throw new Error("No user skills found");
            }

            return result;
        } catch (err) {
            throw new Error(`Error with getUserSkills: ${err.message}`);
        } finally {
            if (conn) conn.release();
        }
    }

    /**
     * Deletes a specified user skill.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique values to look up in the database, e.g. {userId: 1, skillId: 1}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message stating if the user skill has been deleted or not.
     */
    static async deleteUserSkill(identifier, connection) {
        try {
            if (!identifier || Object.keys(identifier).length < 2 || Object.keys(identifier).length > 2) {
                throw new Error("Must only provide both the 'userId' and the 'skillId'");
            }

            let id1 = camelCaseToSnakeCase(Object.keys(identifier)[0]);
            let id2 = camelCaseToSnakeCase(Object.keys(identifier)[1]);
            let values = Object.values(identifier);

            let sql = `DELETE FROM ${this.#table} WHERE ${id1} = ? AND ${id2} = ?`;

            const result = await db.delete(null, null, values, connection, sql);

            if (result.affectedRows) {
                return "User skill successfully deleted";
            } else {
                throw new Error("Could not find user skill to delete");
            }
        } catch (err) {
            throw new Error(`Error with deleteUserSkill: ${err.message}`);
        }
    }
}

module.exports = UserSkills;
