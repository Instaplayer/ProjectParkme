let net
let debugNet
let ui
let game

window.onload = async () => {
    
    net = new Net()
    debugNet = new DebugNet()
    ui = new Ui()

    let stockArray = await net.getMapData()
    let translatedArray = []
    stockArray.forEach(element => {
        translatedArray[element._id - 1] = []
        translatedArray[element._id - 1][0] = element.x
        translatedArray[element._id - 1][1] = element.y
        translatedArray[element._id - 1][2] = element.rotated
        translatedArray[element._id - 1][3] = element.size
    });
    
    game = new Game(translatedArray)

    
    game.updateCarsArray(await net.getMapData())

    ui.hideUiElement(ui.playersFull)
    ui.hideUiElement(ui.awaitPlayer)
    ui.hideUiElement(ui.playerWin)
    ui.hideUiElement(ui.playerLose)

    let loginButton = document.getElementById("submit")
    loginButton.addEventListener('click',async () => {
        let loginInput = document.getElementById("nick")
        if(loginInput.value.length > 0){
            let winnerNumber
            let loginResult = await net.loginAs(loginInput.value)
            console.log(loginResult)

            if(loginResult.status == "success"){
                ui.hideUiElement(ui.mainLogin)
                ui.showUiElement(ui.awaitPlayer)

                handleWinner = setInterval(async ()=>{

                    let winData = await net.getWinner()

                    if(winData.winner == 0){
                        if(game.winState){
                            net.sendWinner()
                            winnerNumber = winData.winner
                            console.log("WIN")

                            ui.showUiElement(ui.UIbase)
                            ui.showUiElement(ui.playerWin)

                            setTimeout( () => {
                               window.location.reload() 
                            },2500)

                            clearInterval(handleWinner)
                        }
                    }
                    else{
                        console.log("LOST")
                        winnerNumber = winData.winner
                        if(ui.playerWin.style.display == "none"){
                            ui.showUiElement(ui.UIbase)
                            ui.showUiElement(ui.playerLose)
                        }

                        setTimeout( () => {
                            window.location.reload() 
                        },2500)

                        clearInterval(handleWinner)
                    }

                }, 20)

                for(;;){
                    let playerList = await net.getAllUsers()
                    if(playerList.length > 1){
                        if(net.playerList){
                            if(net.playerList.length < playerList.length){
                                net.playerList = playerList
                                ui.hideUiElement(ui.awaitPlayer)
                                ui.hideUiElement(ui.UIbase)
                                game.updateCarsArray(await net.getMapData())
                            }
                        }
                        else {
                            net.playerList = playerList
                            ui.hideUiElement(ui.awaitPlayer)
                            ui.hideUiElement(ui.UIbase)
                            game.updateCarsArray(await net.getMapData())
                        }
                    }
                    else{
                        if(net.playerList)
                        if(net.playerList.length > playerList.length){
                            ui.showUiElement(ui.awaitPlayer)
                            ui.showUiElement(ui.UIbase)
                            game.updateCarsArray(await net.getMapData())

                            net.playerList = playerList
                        }
                    }
                }
            }
            else{
                ui.hideUiElement(ui.mainLogin)
                ui.showUiElement(ui.playersFull)

                let awaitEmptySpot = setInterval(async ()=>{
                    let playerList = await net.getAllUsers()
                    if(playerList.length < 2){
                        loginResult = await net.loginAs(loginInput.value)
                        if(loginResult.status == "success"){

                            clearInterval(awaitEmptySpot)

                            ui.hideUiElement(ui.playersFull)
                            ui.showUiElement(ui.awaitPlayer)


                            for(;;){
                                let playerList = await net.getAllUsers()
                                if(playerList.length > 1){
                                    if(net.playerList){
                                        if(net.playerList.length < playerList.length){
                                            net.playerList = playerList
                                            ui.hideUiElement(ui.awaitPlayer)
                                            ui.hideUiElement(ui.UIbase)
                                            game.updateCarsArray(await net.getMapData())
                                        }
                                    }
                                    else {
                                        net.playerList = playerList
                                        ui.hideUiElement(ui.awaitPlayer)
                                        ui.hideUiElement(ui.UIbase)
                                        game.updateCarsArray(await net.getMapData())
                                    }
                                }
                                else{
                                    if(net.playerList)
                                    if(net.playerList.length > playerList.length){
                                        ui.showUiElement(ui.awaitPlayer)
                                        ui.showUiElement(ui.UIbase)
                                        game.updateCarsArray(await net.getMapData())
            
                                        net.playerList = playerList
                                    }
                                }
                            }
                            
                        }
                    }
                },500)
            }
        }
    })

    window.onbeforeunload = () => {
        net.logOut()
    }
}

