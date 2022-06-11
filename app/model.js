// limit graczy w grze, ustaw na -1 lub mniej by go znieść
let playerLimit = 2

// główny array na przechowywanie graczy
let playerArray = []

// klasa gracza
class Player {
    constructor(team, name)
    {
        this.team = team
        this.name = name
    }
}

module.exports = { playerLimit, playerArray, Player }