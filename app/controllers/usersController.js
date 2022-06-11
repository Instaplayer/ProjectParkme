const model = require("../model")

module.exports = {
    getAllUsers: async () => {
        return model.playerArray
    },

    getUserWithID: async (id) => {
        let selectedPlayer
        model.playerArray.forEach(player => {
            if(player.team == id)
            selectedPlayer = player
        })

        if(selectedPlayer)
        return selectedPlayer
        else
        return {status: "error"}
    },

    postUser: async (name) => {

        resObj = {
            data: null,
            status: "error"
        }


        if(model.playerArray.length < model.playerLimit || model.playerLimit < 0){

            for(let x = 1; x < model.playerArray.length + 2; x++){
                let teamFound = x
                model.playerArray.forEach(player => {
                    if(player.team == x){
                        teamFound = 0
                    }
                })

                if(teamFound != 0){
                    plrObject = new model.Player(teamFound, name)
                    model.playerArray.push(plrObject)

                    resObj.data = plrObject
                    resObj.status = "success"
                    break;
                }
            }

        }

        return resObj
    },

    deleteUser: async (teamID) => {

        resObj = {
            data: null,
            status: "error"
        }

        model.playerArray.forEach(player => {
            if(player.team == teamID){
                resObj.data = player,
                resObj.status = "success"

                model.playerArray.splice(model.playerArray.indexOf(player), 1)
            }
        })

        return resObj
    }
}