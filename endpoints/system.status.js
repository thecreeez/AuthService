export default {
    type: "get",
    rights: 0,
    ignoreDatabase: true,
    description: `Returns a status of a auth service.`,
    func: async function ({ req, res, authService }) {
        let hasDatabaseConnection = await authService.db.hasConnection();

        
        const outData = {
            dataConnection: hasDatabaseConnection
        };

        if (!hasDatabaseConnection) {
            outData.lastConnection = authService.db.lastConnection
        } else {
            outData.users = (await authService.db.query("SELECT COUNT(*) FROM `users`"))[0]["COUNT(*)"];
            outData.services = (await authService.db.query("SELECT COUNT(*) FROM `services`"))[0]["COUNT(*)"];
        }

        res.send(authService.formResult({
            status: 1,
            data: await outData
        }))
    }
};