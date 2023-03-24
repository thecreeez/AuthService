export default {
    type: "get",
    rights: 2,
    description: `Create auth token for service and user. (Requires login and password)`,
    func: async function ({ req, res, authService }) {
        let errors = [];

        let login = req.query.login;
        let password = req.query.password;

        if (!login)
            errors.push("login isnt presented.")

        if (!password)
            errors.push("password isnt presented.")

        if (errors.length > 0) {
            res.send(authService.formResult({
                status: 0,
                reason: errors
            }));
            return;
        }

        let userCandidate = await authService.UserModel.getUserByLogin(login);
        let passwordHashed = authService.Util.hashPassword(password);

        if (!userCandidate || userCandidate.password != passwordHashed) {
            res.send(authService.formResult({
                status: 0,
                reason: "Login or password isn't right."
            }));
            return;
        }

        let service = await authService.ServiceModel.getServiceByToken(req.query.token);
        let connection = new authService.UserConnectionModel({
            users_id: userCandidate.id,
            token: authService.Util.generateToken(),
            service_id: service.id
        });

        connection.push();

        res.send(authService.formResult({
            status: 1,
            data: connection.token
        }));
    }
};