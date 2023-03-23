import LoggerInstance from "../service/Logger.js";
let logger = new LoggerInstance("UserConnectionModel");

class UserConnectionModel {
    /**
     * Returns UserConnectionModel by token
     * @param {string} token 
     */
    static async getConnectionByToken(token) {
        if (!this.db) {
            logger.log("Cant return UserConnection. Database is not initialized.");
            return null;
        }

        let dbUser = await this.db.query("SELECT * FROM `users_tokens` WHERE `users_tokens`.`token` = ?", [token]);

        if (dbUser.length == 0) {
            return null;
        }

        return new UserConnectionModel(dbUser[0]);
    }

    static async getConnectionsByUserAndService(userModel, serviceModel) {
        if (!this.db) {
            logger.log("Cant return UserConnection. Database is not initialized.");
            return null;
        }

        let dbConnections = await this.db.query("SELECT * FROM `users_tokens` WHERE `users_tokens`.`users_id` = ? AND `users_tokens`.`service_id` = ?", [userModel.id, serviceModel.id]);
        let connections = [];

        dbConnections.forEach((dbConnection) => {
            connections.push(new UserConnectionModel(dbConnection));
        })
        return connections;
    }

    static async removeAllByUserConnection(userConnectionModel) {
        if (!this.db) {
            logger.log("Cant remove UserConnections. Database is not initialized.");
            return null;
        }

        let dbConnections = await this.db.query("DELETE FROM `users_tokens` WHERE `users_tokens`.`users_id` = ? AND `users_tokens`.`service_id`", [userConnectionModel.users_id, userConnectionModel.service_id]);

        return dbConnections;
    }

    constructor({ id, users_id, token, service_id }) {
        this.id = id;
        this.users_id = users_id;
        this.token = token;
        this.service_id = service_id;
    }

    async push() {
        if (!UserConnectionModel.db) {
            logger.log("Cant return UserConnection. Database is not initialized.");
            return null;
        }

        let dbCheck = await UserConnectionModel.db.query("SELECT * FROM `users_tokens` WHERE `users_tokens`.`id` = ?", [this.id]);

        if (dbCheck.length > 0) {
            return false;
        }

        return await UserConnectionModel.db.query("INSERT INTO `users_tokens` (`id`, `users_id`, `token`, `service_id`) VALUES (NULL, ?, ?, ?);", [this.users_id, this.token, this.service_id])
    }

    async remove() {
        if (!UserConnectionModel.db) {
            logger.log("Cant remove UserConnection. Database is not initialized.");
            return null;
        }

        let dbCheck = await UserConnectionModel.db.query("SELECT * FROM `users_tokens` WHERE `users_tokens`.`id` = ?", [this.id]);

        if (dbCheck.length == 0) {
            return false;
        }

        return await UserConnectionModel.db.query("DELETE FROM `users_tokens` WHERE `users_tokens`.`id` = ?", [this.id])
    }
}

export default UserConnectionModel;