const Database = require("../config/Database");

const databaseCRUD = {
    create: async function (table, columns, placeholders, values, connection) {
        let conn;

        try {
            let sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

            conn = connection ? connection : await Database.getPool().getConnection();
            const [result] = await conn.execute(sql, values);

            return result;
        } catch (err) {
            throw new Error(err.message);
        } finally {
            if (conn) conn.release();
        }
    },

    read: async function (selection, table, identifier, values, connection) {
        let conn;
        let sql;

        try {
            if (identifier) {
                sql = `SELECT ${selection} FROM ${table} WHERE ${identifier} = ?`;
            } else {
                sql = `SELECT ${selection} FROM ${table}`;
            }

            conn = connection ? connection : await Database.getPool().getConnection();
            const result = await conn.execute(sql, values);

            return result;
        } catch (err) {
            throw new Error(err.message);
        } finally {
            if (conn) conn.release();
        }
    },

    update: async function (table, updateColumns, identifier, values, connection) {
        let conn;

        try {
            let sql = `UPDATE ${table} SET ${updateColumns} WHERE ${identifier} = ? LIMIT 1`;

            conn = connection ? connection : await Database.getPool().getConnection();
            const [result] = await conn.execute(sql, values);

            return result;
        } catch (err) {
            throw new Error(err.message);
        } finally {
            if (conn) conn.release();
        }
    },

    delete: async function (table, identifier, values, connection, customSQL) {
        let conn;
        let sql;

        try {
            if (customSQL) {
                sql = customSQL;
            } else {
                sql = `DELETE FROM ${table} WHERE ${identifier} = ? LIMIT 1`;
            }

            conn = connection ? connection : await Database.getPool().getConnection();
            const [result] = await conn.execute(sql, values);

            return result;
        } catch (err) {
            throw new Error(err.message);
        } finally {
            if (conn) conn.release();
        }
    },
};

module.exports = databaseCRUD;
