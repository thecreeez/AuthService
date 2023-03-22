import MySQL from "mysql2";
import LoggerInstance from "./Logger.js";
let logger = new LoggerInstance("Database");

const CFG = {
    host: "localhost",
    user: "root",
    password: "",
    database: "auth_service"
}

let conn = null;

class Database {
    static async hasConnection() {
        conn = MySQL.createConnection(CFG);
        try {
            await conn.promise().ping()
            await conn.end();

            this.lastConnection = new Date();
            return true;
        } catch (e) {
            logger.log("Database wasn't working, err: ", e.code)
            return false;
        }
    }

    static async query(sql) {
        conn = MySQL.createConnection(CFG);

        try {
            const result = await conn.promise().query(sql);

            await conn.end();
            this.lastConnection = new Date();
            return result[0];
        } catch(e) {
            logger.log("Database wasn't working, err: ", e)
            return "ERR-0";
        }
    }
}

export default Database;