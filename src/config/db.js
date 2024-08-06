const mysql = require('mysql2/promise');
const { dbHost, dbPassword, databaseName, dbUser } = require('../secret');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: dbHost,
                user: dbUser,
                database: databaseName,
                password: dbPassword,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    async getConnection() {
        try {
            return await this.pool.getConnection();
        } catch (error) {
            console.error('Error getting connection from the pool:', error);
            throw error;
        }
    }
}

module.exports = new Database();


