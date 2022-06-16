var express = require("express");
var app = express()
const PORT = 3000;
const Datastore = require('nedb')
const map1 = new Datastore({
    filename: 'databases/map1.db',
    autoload: true
});
const map2 = new Datastore({
    filename: 'databases/map2.db',
    autoload: true
});
let id1 = 0;
let id2 = 0;
let cars1 = [
    [-350, 475, true],
    // [-450, 425],
    // [-450, 375],
    // [-450, 325],
    // [-450, 275],
    // [-450, 225],
    // [-450, 175],
    // [-450, 125],
    // [-450, 75],
    [50, 475, true],
    // [50, 425],
    // [50, 375],
    // [50, 325],
    // [50, 275],
    [150, 475, false],
    // [150, 325]
]
let cars2 = [
    [-450, 425, true],
    [-450, 375, false],
    [-450, 325, true]
]
const usersRouter = require("./app/routers/usersRouter")

app.use(express.static('static'))
app.use(express.json())

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

// users
app.all(/\/api\/users/, async (req, res, next) => {
    await usersRouter(req, res)
    next()
})



//-------------------------------------------------- bazy ---- mapa1 
map1.remove({}, { multi: true }, function (err, numRemoved) {
});
for (let i = 0; i < cars1.length; i++) {
    const carObject = {
        id: id1,
        x: cars1[i][0],
        y: cars1[i][1],
        rotation: cars1[i][2]
    };
    map1.insert(carObject, function (err, newDoc) {
    });
    id1++;
}
map1.find({}, function (err, docs) {
    //zwracam dane w postaci JSON
    console.log("----- tablica obiektów pobrana z bazy: \n")
    console.log(docs)
});
// -------------------------------------------------- mapa2
map2.remove({}, { multi: true }, function (err, numRemoved) {
});
for (let i = 0; i < cars2.length; i++) {
    const carObject = {
        id: id2,
        x: cars2[i][0],
        y: cars2[i][1],
        rotation: cars2[i][2]
    };
    map2.insert(carObject, function (err, newDoc) {
    });
    id2++;
}
map2.find({}, function (err, docs) {
    //zwracam dane w postaci JSON
    console.log("----- tablica obiektów pobrana z bazy: \n")
    console.log(docs)
});
