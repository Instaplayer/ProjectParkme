class Ui {
    constructor(){
        this.mainLogin = document.getElementById("log")
        this.awaitPlayer = document.getElementById("wait")
        this.UIbase = document.getElementById("background")
        this.playersFull = document.getElementById("playersFull")
        this.playerWin = document.getElementById("playerWin")
        this.playerLose = document.getElementById("playerLose")
    }

    hideUiElement(element){
        element.style.display = "none"
    }

    showUiElement(element){
        element.style.display = ""
    }

    showEnemyWinner(user){
        this.playerLose.children[0].innerHTML = "Przegrałeś! <br> pokonał cię " + user.name
    }
}