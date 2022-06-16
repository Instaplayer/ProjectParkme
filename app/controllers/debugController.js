const model = require("../model")

module.exports = {
    purgeAllUsers: async () => {
        model.playerArray = []
        return {status: "Purged"}
    }
}