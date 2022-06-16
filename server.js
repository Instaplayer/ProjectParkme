var express = require("express");
var app = express()
const PORT = process.env.PORT || 3000;

const usersRouter = require("./app/routers/usersRouter")
const gameRouter = require("./app/routers/gameRouter")
const debugRouter = require("./app/routers/debugRouter")


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

// game
app.all(/\/api\/game/, async (req, res, next) => {
    await gameRouter(req, res)
    next()
})

// remote debugging (by nie musieć re-deployować)
app.all(/\/api\/debug/, async (req, res, next) => {
    await debugRouter(req, res)
    next()
})