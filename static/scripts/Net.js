class Net {
    constructor(){}

    loginAs = async (nickname) => {

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nickname
            })
        }

        let response = await fetch("/api/users", options)
        if(!response.ok)
            return response.status
        else
            return response.json().then(data => {

                if(data.status == "success"){
                    this.player = data.data
                }

                return data
            })

    }

    logOut = async () => {
        const options = {
            method: "DELETE",
        }

        let response = await fetch("/api/users/" + this.player.team, options)
        if(!response.ok)
            return response.status
        else
            return response.json().then(data => {
                return data
            })
    }

    getAllUsers = async () => {

        const options = {
            method: "GET"
        }

        let response = await fetch("/api/users", options)
        if(!response.ok)
            return response.status
        else
            return response.json().then(data => {
                return data
            })
    }
}