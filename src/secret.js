require("dotenv").config({ path: ".env" });

const serverPort = process.env.SERVER_PORT || 5001;
const dbHost = process.env.DB_HOST || "";
const dbUser = process.env.DB_USER || "";
const databaseName = process.env.DB_Name || "";
const dbPassword = process.env.DB_PASSWORD || "";


module.exports = {
	serverPort,
	dbHost,
	dbUser,
	databaseName,
	dbPassword
};
