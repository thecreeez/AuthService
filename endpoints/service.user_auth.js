export default {
  type: "get",
  rights: 2,
  description: `Auth user by token.`,
  func: async function ({ req, res, authService }) {
    let serviceToken = req.query.token;
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

    let userModel = await authService.UserModel.getUserById(userConnectionModel.users_id);

    res.send(authService.formResult({
      status: 1,
      data: userModel.login
    }));
  }
};