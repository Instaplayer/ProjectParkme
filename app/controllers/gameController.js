const model = require("../model")
const Datastore = require('nedb');

const map = new Datastore({
    filename: 'app/databases/map.db',
    autoload: true
});

module.exports = {

    refreshMapDB: async (array)=>{

        for(index = 0; index < array.length; index++){
            map.remove({_id: index})
        }
        map.persistence.compactDatafile()

        for(index = 0; index < array.length; index++){
            const doc = {
                _id: index + 1,
                x: array[index][0],
                y: array[index][1],
                rotated: array[index][2],
                size: array[index][3]
            }

            map.insert(doc)
        }
    },

    getMapDB: async ()=>{
        return new Promise(resolve => {
            map.find({ }, function (err, docs) {
                resolve({ "map": docs })
            });
        })
    },

    setEndGame: async (winner) => {
        model.winningTeam = parseInt(winner)
    },

    getEndGame: async () => {
        return {winner: model.winningTeam}
    }

}