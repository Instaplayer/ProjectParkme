const debugController = require("../controllers/debugController")

const router = async (req, res) => {

    if (req.url.match(/\/api\/debug\/purgeAllUsers/)) {

        if (req.method == "POST") {
            let endData = await debugController.purgeAllUsers()
            res.end(JSON.stringify(endData))
        }
    }
}

module.exports = router