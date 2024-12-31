const mysql = require("mysql2/promise");

class Database {
    #host = process.env.MYSQL_HOST;
    #user = process.env.MYSQL_USER;
    #password = process.env.MYSQL_PASSWORD;
    #database = process.env.MYSQL_DATABASE;

    getPool() {
        const pool = mysql.createPool({
            host: this.#host,
            user: this.#user,
            password: this.#password,
            database: this.#database,
        });

        return pool;
    }
}

module.exports = new Database();
