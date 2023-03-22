export default {
    type: "get",
    rights: 3,
    description: `Generates a invitation service key`,
    func: async function ({ req, res, authService }) {
        let invitationKeyModel = new authService.InvitationKeyModel({
            invitation_key: authService.Util.generateToken()
        });

        let pushResult = await invitationKeyModel.push();

        if (!pushResult) {
            res.send(authService.formResult({
                status: 0,
                reason: "We've got some problems with create invitation key: "+pushResult
            }))
            return;
        }

        res.send(authService.formResult({
            status: 1,
            data: invitationKeyModel.invitation_key
        }))
    }
};