var express = require("express");
var app = express()
const PORT = 3000;

const usersRouter = require("./app/routers/usersRouter")

app.use(express.static('static'))
app.use(express.json())

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})

// users
app.all(/\/api\/users/, async (req, res, next) => {
    await usersRouter(req, res)
    next()
})

