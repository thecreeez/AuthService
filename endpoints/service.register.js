export default {
    type: "get",
    rights: 0,
    description: `Register a new service (Requires: invitationKey, id, name)`,
    func: async function ({ req, res, authService }) {
        let errors = [];
        if (!req.query.invitationKey) {
            errors.push("Required invitation key (invitationKey field)");
        }

        if (!req.query.id) {
            errors.push("Required string id (id field)");
        }

        if (!req.query.name) {
            errors.push("Required name (name field)");
        }

        if (errors.length > 0) {
            res.send(authService.formResult({
                status: 0,
                reason: errors
            }))
            return;
        }

        let invitationKey = req.query.invitationKey;

        let invitationKeyModel = await authService.InvitationKeyModel.getKeyModel(invitationKey);

        if (!invitationKeyModel) {
            res.send(authService.formResult({
                status: 0,
                reason: "Invitation key already used or not exist."
            }))
            return;
        }

        let name = req.query.name;
        let id = req.query.id.toLowerCase();

        let serviceModel = new authService.ServiceModel({
            name: name,
            string_id: id,
            token: authService.Util.generateToken()
        });

        let pushResult = await serviceModel.canPush();

        if (!pushResult) {
            res.send(authService.formResult({
                status: 0,
                data: "This id is already used."
            }));
            return;
        }

        let removeKeyResult = await invitationKeyModel.remove();

        if (!removeKeyResult) {
            res.send(authService.formResult({
                status: 0,
                reason: "We've got some problems with key. Try again later."
            }));
            return;
        }

        await serviceModel.push();

        res.send(authService.formResult({
            status: 1,
            data: serviceModel.token
        }))
    }
};