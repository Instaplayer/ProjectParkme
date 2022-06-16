const gameController = require("../controllers/gameController")

let carsBaseArray = [
    [-350, 475, true, 2],
    [50, 475, true, 2],
    [150, 475, false, 2]
]

const router = async (req, res) => {


    if (req.url.match(/\/api\/game\/map/))
    {
        if(req.method == "GET") {
            mapData = await gameController.getMapDB()
            res.end(JSON.stringify(mapData))
        }

        // służy odświeżeniu mapy
        if(req.method == "POST") {
            await gameController.refreshMapDB(carsBaseArray)
            res.end()
        }
    }

    else if (req.url.match(/\/api\/game\/win\/([1-9]+)/)){

        let urlSplit = req.url.split('/')

        if(req.method == "POST") {
            await gameController.setEndGame(urlSplit[4])
            winData = await gameController.getEndGame()
            res.end(JSON.stringify(winData))
        }
    }

    else if (req.url.match(/\/api\/game\/win/)){
        if(req.method == "GET"){
            winData = await gameController.getEndGame()
            res.end(JSON.stringify(winData))
        }
    }
}

module.exports = router