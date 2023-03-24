export default {
    type: "get",
    rights: 2,
    description: `Logout user from service. (requires userToken)`,
    func: async function ({ req, res, authService }) {
        let userToken = req.query.userToken;

        if (!userToken) {
            res.send(authService.formResult({
                status: 0,
                reason: "User token is not present."
            }));
            return;
        }

        let userConnectionModel = await authService.UserConnectionModel.getConnectionByToken(userToken);

        if (!userConnectionModel) {
            res.send(authService.formResult({
                status: 0,
                reason: "User connection with this token isn't exist."
            }));
            return;
        }

        userConnectionModel.remove();

        res.send(authService.formResult({
            status: 1
        }));
    }
};