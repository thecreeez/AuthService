import DatabaseService from "./DatabaseService.js";
import EndpointService from "./EndpointService.js";
import LoggerInstance from "./Logger.js";
import Util from "./Util.js";
let logger = new LoggerInstance("System");

const ENDPOINT_RIGHTS = {
    DEFAULT: 0,
    USER: 1,
    SERVICE: 2,
    ADMIN: 3
}

const ADMIN_TOKEN = Util.generateToken();

class AuthService {
    static start({endpoints, models}) {
        logger.log("Admin token for session:", ADMIN_TOKEN);
        logger.log(`Запуск сервера авторизации...`);
        try {
            this._loadModels(models);
            
            this.endpoints = endpoints;
            EndpointService.start(endpoints, 3000, this);

            this.Util = Util;
        } catch(e) {
            logger.log(`Не удалось запустить сервис авторизации: `, e);
        }
    }

    static _loadModels(models) {
        logger.log("Загрузка моделей...");
        models.forEach((model,index) => {
            logger.log("Загрузка модели "+model.name)
            this[model.name] = model.model;
            this[model.name].db = DatabaseService;
        })
        logger.log("Загрузка моделей завершена.");

        this.db = DatabaseService;
        this.db.lastConnection = "Never";
    }

    static formResult({status, reason, data}) {
        if (status < 1) {
            return {
                result: "error",
                reason: reason
            }
        }

        return {
            result: "ok",
            data: data
        }
    }

    static async hasRights(level, params) {
        switch (level) {
            case ENDPOINT_RIGHTS.DEFAULT: return true;
            case ENDPOINT_RIGHTS.USER: {
                let password = this.Util.hashPassword(params.password);
                return await this.UserModel.checkAuth(params.login, password);
            };
            case ENDPOINT_RIGHTS.SERVICE: return await this.ServiceModel.checkToken(params.token);
            case ENDPOINT_RIGHTS.ADMIN: return ADMIN_TOKEN == params.token;
            default: return false;
        }
    }
}

export default AuthService;