export default {
    type: "get",
    rights: 2,
    description: `Removing existing service (Requires: service token)`,
    func: async function ({ req, res, authService }) {
        let service = await authService.ServiceModel.getServiceByToken(req.query.token);
        service.remove();

        res.send(authService.formResult({
            status: 1,
            data: service
        }));
    }
};