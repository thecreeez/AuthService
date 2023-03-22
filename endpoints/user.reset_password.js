export default {
    type: "get",
    rights: 1,
    description: `Changing password to a password from "new_password" field (Need: login,password)`,
    func: async function ({ req, res, authService }) {
        let newPassword = req.query.new_password;

        if (!newPassword) {
            res.send(authService.formResult({
                status: 0,
                reason: "New password isnt exist (new_password field)."
            }));
            return;
        }

        let user = await authService.UserModel.getUserByLogin(req.query.login);

        if (!user) {
            res.send(authService.formResult({
                status: 0,
                reason: "User not finded."
            }));
            return;
        }

        let newPasswordHashed = authService.Util.hashPassword(newPassword);

        if (newPasswordHashed == user.password) {
            res.send(authService.formResult({
                status: 0,
                reason: "New and old password are the same."
            }));
            return;
        }

        user.update("password", newPasswordHashed);

        res.send(authService.formResult({
            status: 1,
            data: "Password successfully changed."
        }));
    }
};