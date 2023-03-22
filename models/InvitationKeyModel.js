import LoggerInstance from "../service/Logger.js";
let logger = new LoggerInstance("InvitationKeyModel");

class InvitationKeyModel {
    /**
     * Returns a key model for registering new service
     * @param {String} invitationKey 
     * @returns {InvitationKeyModel}
     */
    static async getKeyModel(invitationKey) {
        if (!this.db) {
            logger.log("Cant get key. Database is not initialized.");
            return null;
        }

        let dbKey = await this.db.query("SELECT * FROM `services_keys` WHERE `services_keys`.`invitation_key` = '" + invitationKey + "'");

        if (dbKey.length == 0) {
            return false;
        }

        return new InvitationKeyModel(dbKey[0]);
    }

    static async removeKey(invitationKeyModel) {
        if (!this.db) {
            logger.log("Cant remove key. Database is not initialized.");
            return null;
        }

        let dbKey = await this.db.query("DELETE FROM `services_keys` WHERE `services_keys`.`invitation_key` = '" + invitationKeyModel.invitation_key +"'");

        return dbKey;
    }

    /**
     * NOT STATIC
     */

    constructor({ id, invitation_key }) {
        this.id = id;
        this.invitation_key = invitation_key;
    }
    
    async push() {
        if (!InvitationKeyModel.db) {
            logger.log("Cant remove InvitationKey. Database is not initialized.");
            return null;
        }

        let dbCheck = await InvitationKeyModel.db.query("SELECT * FROM `services_keys` WHERE `services_keys`.`invitation_key` = '" + this.invitation_key + "'");

        if (dbCheck.length > 0) {
            return false;
        }

        return await InvitationKeyModel.db.query("INSERT INTO `services_keys` (`id`, `invitation_key`) VALUES (NULL, '" + this.invitation_key + "');")
    }

    async remove() {
        if (!InvitationKeyModel.db) {
            logger.log("Cant remove InvitationKey. Database is not initialized.");
            return null;
        }

        let dbCheck = await InvitationKeyModel.db.query("SELECT * FROM `services_keys` WHERE `services_keys`.`invitation_key` = '" + this.invitation_key + "'");

        if (dbCheck.length == 0) {
            return false;
        }

        return await InvitationKeyModel.db.query("DELETE FROM `services_keys` WHERE `services_keys`.`invitation_key` = '"+this.invitation_key+"';")
    }
}

export default InvitationKeyModel;