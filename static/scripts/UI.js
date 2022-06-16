class Ui {
    constructor(){
        this.mainLogin = document.getElementById("log")
        this.awaitPlayer = document.getElementById("wait")
        this.UIbase = document.getElementById("background")
        this.playersFull = document.getElementById("playersFull")
    }

    toggleUiElement(element){
        if(element.style.display == "none")
        element.style.display = ""
        else
        element.style.display = "none"
    }
}