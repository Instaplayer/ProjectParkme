const usersController = require("../controllers/usersController")

const router = async (req, res) => {

    if(req.url.match(/\/api\/users\/([1-9]+)/)){

        let urlSplit = req.url.split('/')

        if(req.method == "GET"){
            let endData = await usersController.getUserWithID(urlSplit[3])
            res.end(JSON.stringify(endData))
        }

        if(req.method == "DELETE"){
            let endData = await usersController.deleteUser(urlSplit[3])
            res.end(JSON.stringify(endData))
        }
    }    

    else if(req.url.match(/\/api\/users/)){
        if(req.method == "GET"){
            let endData = await usersController.getAllUsers()
            res.end(JSON.stringify(endData))
        }

        if(req.method == "POST"){
            let reqData = req.body
            let endData = await usersController.postUser(reqData.name)
            res.end(JSON.stringify(endData))
        }
    }
}

module.exports = router