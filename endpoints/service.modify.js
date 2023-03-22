export default {
    type: "get",
    rights: 2,
    description: `Modifying existing service (Requires: service token (token field), modifying field (name/id/token), new field value (except token, token generates automatically))`,
    func: async function ({ req, res, authService }) {
        let service = await authService.ServiceModel.getServiceByToken(req.query.token);
        let errors = [];

        let field = req.query.field;

        if (!field)
            errors.push("field is not present. (available: string_id/name/token)")

        let value = req.query.value;

        if (!value && field != "token")
            errors.push("value is not present.")

        if (errors.length > 0) {
            res.send(authService.formResult({
                status: 0,
                reason: errors
            }));
            return;
        }

        if (field == "token")
            value = authService.Util.generateToken();

        service.update(field, value);

        res.send(authService.formResult({
            status: 1,
            data: service
        }));
    }
};