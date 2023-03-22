export default {
    type: "get",
    rights: 2,
    description: `Modifying existing service (Requires: service token (token field), modifying field (name/id/token), new field value (except token, token generates automatically))`,
    func: async function ({ req, res, authService }) {
        let service = await authService.ServiceModel.getServiceByToken(req.query.token);
        service.remove();

        res.send(authService.formResult({
            status: 1,
            data: service
        }));
    }
};