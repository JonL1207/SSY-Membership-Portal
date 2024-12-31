const bcrypt = require("bcryptjs");
const db = require("../utils/databaseCRUD");
const camelCaseToSnakeCase = require("../utils/camelCaseToSnakeCase");
const formatDatabaseInserts = require("../utils/formatDatabaseInserts");

class User {
    static #table = "user";
    static #columns = ["id", "first_name", "last_name", "pronouns", "date_of_birth", "council", "city", "phone_number", "email", "password"];
    static #schema = {
        // schema from express validator used in controller
        firstName: {
            in: ["body"],
            notEmpty: true,
            isString: true,
            trim: true,
            errorMessage: "Must provide a first name",
        },
    };

    /**
     * Gets the schema to validate user data.
     *
     * @static
     * @returns {object} Schema to be used for validation.
     */
    static getUserSchema() {
        return this.#schema;
    }

    /**
     * Hashs a given password.
     *
     * @static
     * @async
     * @param {string} password The password given by the user.
     * @returns {string} The given password as a hashed password.
     */
    static async #hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (err) {
            throw new Error(`Error hashing password: ${err.message}`);
        }
    }

    /**
     * Compares a password to a hashed password to see if they match.
     *
     * @static
     * @async
     * @param {string} password The password given by the user.
     * @param {string} hashedPassword The password store in the database.
     * @returns {boolean} True if passwords are the same, false if not.
     */
    static async comparePassword(password, hashedPassword) {
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match;
        } catch (err) {
            throw new Error(`Error comparing password: ${err.message}`);
        }
    }

    /**
     * Saves a new user into the database. User format should be as follows:
     *
     * {
     *
     *      firstName: String,
     *      lastName: String,
     *      pronouns: String,
     *      dateOfBirth: String<YYYY-MM-DD>,
     *      council: String,
     *      city: String,
     *      phoneNumber: String,
     *      email: String<Required>,
     *      password: String<Required>
     * }
     *
     * @static
     * @async
     * @param {object} newUser The user to saved to the database.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {number} ID of the new user in database.
     */
    static async createNewUser(newUser, connection) {
        try {
            if (!newUser || Object.keys(newUser).length === 0) {
                throw new Error("Must provide a user");
            }

            if (!Object.keys(newUser).includes("email") || !Object.keys(newUser).includes("password")) {
                throw new Error("User must have an email and password");
            }

            newUser.password = await this.#hashPassword(newUser.password);

            let data = formatDatabaseInserts(newUser);

            const result = await db.create(this.#table, data.columns, data.placeholders, data.values, connection);

            return result.insertId;
        } catch (err) {
            throw new Error(`Error with createNewUser: ${err.message}`);
        }
    }

    /**
     * Finds and returns a user from the database based on the identifier given.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array} An array containing the user retrieved from the database.
     */
    static async getUser(identifier, connection) {
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
                throw new Error("No user found");
            }
        } catch (err) {
            throw new Error(`Error with getUser: ${err.message}`);
        }
    }

    /**
     * Gets all users stored within the database.
     *
     * @static
     * @async
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {array<object>} An array of objects containing all users.
     */
    static async getAllUsers(connection) {
        try {
            let selection = this.#columns.slice(0, 9).join(", ");

            const result = await db.read(selection, this.#table, null, null, connection);

            if (result[0].length > 0) {
                return result[0];
            } else {
                throw new Error("No users found");
            }
        } catch (err) {
            throw new Error(`Error with getAllUsers: ${err.message}`);
        }
    }

    /**
     * Updates a user currently in the database.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} update An object containing the updates to be done on a users' columns e.g. { firstName: "first", lastName: "last" }.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message stating if the database has been updated or not.
     */
    static async updateUser(identifier, update, connection) {
        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
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
                return "User successfully updated";
            } else {
                throw new Error("User does not exist or existing data already matches update, therefore could not update");
            }
        } catch (err) {
            throw new Error(`Error with updateUser: ${err.message}`);
        }
    }

    /**
     * Deletes a specified user currently in the database.
     *
     * @static
     * @async
     * @param {object} identifier An object containing the unique value to look up in the database, e.g. {id: 123} || {email: 'email@email.com'}.
     * @param {object} [connection] An optional connection object passed in when using transactions. Can be set to null or left undefined if not used.
     * @returns {string} A message stating if the user has been deleted or not.
     */
    static async deleteUser(identifier, connection) {
        try {
            if (!identifier || Object.keys(identifier).length === 0 || Object.keys(identifier).length > 1) {
                throw new Error("Must provide one and only one field to search by");
            }

            let id = camelCaseToSnakeCase(Object.keys(identifier)[0]);
            let values = Object.values(identifier);

            const result = await db.delete(this.#table, id, values, connection);

            if (result.affectedRows) {
                return "User successfully deleted";
            } else {
                throw new Error("User does not exist, therefore could not delete");
            }
        } catch (err) {
            throw new Error(`Error with deleteUser: ${err.message}`);
        }
    }
}

module.exports = User;
