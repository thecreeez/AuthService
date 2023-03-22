import LoggerInstance from "../service/Logger.js";
let logger = new LoggerInstance("ServiceModel");

class ServiceModel {
    /**
     * Returns ServiceModel by service id
     * @param {string} id 
     */
    static async getServiceById(id) {
        if (!this.db) {
            logger.log("Cant return Service. Database is not initialized.");
            return null;
        }

        let dbService = await this.db.query("SELECT * FROM `services` WHERE `services`.`string_id` = '" + id + "'");

        if (dbService.length == 0) {
            return null;
        }

        return new ServiceModel(dbService[0]);
    }

    static async checkToken(token) {
        if (!this.db) {
            logger.log("Cant return Service. Database is not initialized.");
            return null;
        }

        let dbService = await this.db.query("SELECT * FROM `services` WHERE `services`.`token` = '" + token + "'");

        if (dbService.length == 0) {
            return false;
        }

        return true;
    }

    static async getServiceByToken(token) {
        if (!this.db) {
            logger.log("Cant return Service. Database is not initialized.");
            return null;
        }

        let dbService = await this.db.query("SELECT * FROM `services` WHERE `services`.`token` = '" + token + "'");

        if (dbService.length == 0) {
            return false;
        }

        return new ServiceModel(dbService[0]);
    }

    /*
            NOT STATIC
    */

    constructor({ id, name, string_id, token }) {
        this.id = id;
        this.name = name;
        this.string_id = string_id;
        this.token = token;
    }

    async canPush() {
        if (!ServiceModel.db) {
            logger.log("Cant return Service. Database is not initialized.");
            return null;
        }

        let dbCheck = await ServiceModel.db.query("SELECT * FROM `services` WHERE `services`.`string_id` = '" + this.string_id + "'");

        if (dbCheck.length > 0) {
            return false;
        }

        return true;
    }

    async push() {
        if (!ServiceModel.db) {
            logger.log("Cant return Service. Database is not initialized.");
            return null;
        }

        let dbCheck = await ServiceModel.db.query("SELECT * FROM `services` WHERE `services`.`string_id` = '" + this.string_id + "'");

        if (dbCheck.length > 0) {
            return false;
        }

        return await ServiceModel.db.query("INSERT INTO `services` (`id`, `string_id`, `name`, `token`) VALUES (NULL, '"+this.string_id+"', '"+this.name+"', '"+this.token+"');")
    }

    async update(field, value) {
        this[field] = value;
        let dbCheck = await ServiceModel.db.query("UPDATE `services` SET `"+field+"` = '"+value+"' WHERE `services`.`id` = "+this.id+";");

        return dbCheck;
    }

    async remove() {
        if (!ServiceModel.db) {
            logger.log("Cant remove Service. Database is not initialized.");
            return null;
        }

        let dbCheck = await ServiceModel.db.query("SELECT * FROM `services` WHERE `services`.`id` = '" + this.id + "'");

        if (dbCheck.length == 0) {
            return false;
        }

        return await ServiceModel.db.query("DELETE FROM `services` WHERE `services`.`id` = '" + this.id + "';")
    }
}

export default ServiceModel;