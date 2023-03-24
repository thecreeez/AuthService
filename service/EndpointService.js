import LoggerInstance from "./Logger.js";
let logger = new LoggerInstance("Endpoint");

import express from "express";

let app = express();
app.set('view engine', 'ejs')

class EndpointService {
    static start(endpoints, port, authService) {
        logger.log(`Запуск эндпоинтов...`);

        endpoints.forEach((endpoint) => {
            logger.log(`Запуск эндпоинта ${endpoint.id}`);
            app[endpoint.type]("/api"+endpoint.url, async (req, res) => {
                logger.log("Запрос: Эндпоинт: "+endpoint.id+" ip:"+req.socket.remoteAddress);
                if (endpoint.ignoreDatabase) {
                    endpoint.func({
                        req: req,
                        res: res,
                        authService: authService
                    });
                    return;
                }

                let hasDBConn = await authService.db.hasConnection();
                if (!hasDBConn) {
                    res.send(authService.formResult({
                        status: -1,
                        reason: "Database connection problems, author already known about it. Sorry."
                    }))
                    return;
                }

                let hasRights = await authService.hasRights(endpoint.rights, req.query);

                if (!hasRights) {
                    res.send(authService.formResult({
                        status: 0,
                        reason: "You have no permission to do that. (Need token or login and password)"
                    }))
                    return; 
                }

                endpoint.func({
                    req: req,
                    res: res,
                    authService: authService
                });
            });
        })

        app.get("*", (req,res) => {
            res.render("index")
        })

        app.get("/api/*", (req,res) => {
            res.send(authService.formResult({
                status: 0,
                reason: "Wrong endpoint."
            }))
        })

        app.listen(port, () => {
            logger.log("Эндпоинты успешно запущены")
        })
    }
}

export default EndpointService;