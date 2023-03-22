export default {
    type: "get",
    rights: 0,
    description: `Registering new user`,
    func: async function ({ req, res, authService }) {
        let errors = [];

        let login = req.query.login;

        if (!login)
            errors.push("login isnt presented.")

        let password = req.query.password;

        if (!password)
            errors.push("password isnt presented.")

        if (errors.length > 0) {
            res.send(authService.formResult({
                status: 0,
                reason: errors
            }));
            return;
        }

        let isExist = await authService.UserModel.getUserByLogin(login);

        if (isExist) {
            res.send(authService.formResult({
                status: 0,
                reason: "User with this login already exist"
            }));
            return;
        }

        let passwordHashed = authService.Util.hashPassword(password);
        
        let user = new authService.UserModel({
            login, 
            password: passwordHashed,
        });
        user.push();

        res.send(authService.formResult({
            status: 1,
            data: "User successfully registered."
        }));
    }
};