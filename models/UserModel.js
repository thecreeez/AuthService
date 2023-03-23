import LoggerInstance from "../service/Logger.js";
let logger = new LoggerInstance("UserModel");

class UserModel {
    /**
     * Returns UserModel by user login
     * @param {string} login 
     */
    static async getUserByLogin(login) {
        if (!this.db) {
            logger.log("Cant return User. Database is not initialized.");
            return null;
        }

        let dbUser = await this.db.query("SELECT * FROM `users` WHERE `users`.`login` = ?", [login]);

        if (dbUser.length == 0) {
            return null;
        }

        return new UserModel(dbUser[0]);
    }

    static async getUserById(id) {
        if (!this.db) {
            logger.log("Cant return User. Database is not initialized.");
            return null;
        }

        let dbUser = await this.db.query("SELECT * FROM `users` WHERE `users`.`id` = ?", [id]);

        if (dbUser.length == 0) {
            return null;
        }

        return new UserModel(dbUser[0]);
    }

    static async checkAuth(login, password) {
        if (!this.db) {
            logger.log("Cant return User. Database is not initialized.");
            return null;
        }

        let dbUser = await this.db.query("SELECT * FROM `users` WHERE `users`.`login` = ?", [login]);

        if (dbUser.length == 0) {
            return null;
        }

        return dbUser[0].password == password;
    }

    constructor({ id, login, password }) {
        this.id = id;
        this.login = login;
        this.password = password;
    }

    async canPush() {
        if (!UserModel.db) {
            logger.log("Cant return User. Database is not initialized.");
            return null;
        }

        let dbCheck = await UserModel.db.query("SELECT * FROM `users` WHERE `users`.`id` = ?", [this.id]);

        if (dbCheck.length > 0) {
            return false;
        }

        return true;
    }

    async push() {
        if (!UserModel.db) {
            logger.log("Cant return User. Database is not initialized.");
            return null;
        }

        let dbCheck = await UserModel.db.query("SELECT * FROM `users` WHERE `users`.`id` = ?", [this.id]);

        if (dbCheck.length > 0) {
            return false;
        }

        return await UserModel.db.query("INSERT INTO `users` (`id`, `login`, `password`) VALUES (NULL, ?, ?);", [this.login, this.password])
    }

    // INSECURE
    async update(field, value) {
        this[field] = value;
        let dbCheck = await UserModel.db.query("UPDATE `users` SET `" + field + "` = ? WHERE `users`.`id` = ?;", [this.id]);

        return dbCheck;
    }

    async remove() {
        if (!UserModel.db) {
            logger.log("Cant remove User. Database is not initialized.");
            return null;
        }

        let dbCheck = await UserModel.db.query("SELECT * FROM `users` WHERE `users`.`id` = ?", [this.id]);

        if (dbCheck.length == 0) {
            return false;
        }

        return await UserModel.db.query("DELETE FROM `users` WHERE `users`.`id` = ?;", [this.id])
    }
}

export default UserModel;