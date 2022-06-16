let game
let net
let ui

window.onload = () => {
    game = new Game()
    net = new Net()
    ui = new Ui()

    ui.toggleUiElement(ui.playersFull)
    ui.toggleUiElement(ui.awaitPlayer)

    let loginButton = document.getElementById("submit")
    loginButton.addEventListener('click',async () => {
        let loginInput = document.getElementById("nick")
        if(loginInput.value.length > 0){

            let loginResult = await net.loginAs(loginInput.value)
            console.log(loginResult)

            if(loginResult.status == "success"){
                ui.toggleUiElement(ui.mainLogin)
                ui.toggleUiElement(ui.awaitPlayer)

                for(;;){
                    let playerList = await net.getAllUsers()
                    if(playerList.length > 1){
                        if(net.playerList){
                            if(net.playerList.length < playerList.length){
                                net.playerList = playerList
                                ui.toggleUiElement(ui.awaitPlayer)
                                ui.toggleUiElement(ui.UIbase)
                            }
                        }
                        else {
                            net.playerList = playerList
                            ui.toggleUiElement(ui.awaitPlayer)
                            ui.toggleUiElement(ui.UIbase)
                        }
                    }
                    else{
                        if(net.playerList)
                        if(net.playerList.length > playerList.length){
                            ui.toggleUiElement(ui.awaitPlayer)
                            ui.toggleUiElement(ui.UIbase)

                            net.playerList = playerList
                        }
                    }
                }
            }
            else{
                ui.toggleUiElement(ui.mainLogin)
                ui.toggleUiElement(ui.playersFull)

                let awaitEmptySpot = setInterval(async ()=>{
                    let playerList = await net.getAllUsers()
                    if(playerList.length < 2){
                        loginResult = await net.loginAs(loginInput.value)
                        if(loginResult.status == "success"){

                            clearInterval(awaitEmptySpot)

                            ui.toggleUiElement(ui.playersFull)
                            ui.toggleUiElement(ui.awaitPlayer)


                            for(;;){
                                let playerList = await net.getAllUsers()
                                if(playerList.length > 1){
                                    if(net.playerList){
                                        if(net.playerList.length < playerList.length){
                                            net.playerList = playerList
                                            ui.toggleUiElement(ui.awaitPlayer)
                                            ui.toggleUiElement(ui.UIbase)
                                        }
                                    }
                                    else {
                                        net.playerList = playerList
                                        ui.toggleUiElement(ui.awaitPlayer)
                                        ui.toggleUiElement(ui.UIbase)
                                    }
                                }
                                else{
                                    if(net.playerList)
                                    if(net.playerList.length > playerList.length){
                                        ui.toggleUiElement(ui.awaitPlayer)
                                        ui.toggleUiElement(ui.UIbase)
            
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

