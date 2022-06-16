class DebugNet {
    constructor(){}

    debugPurgeAllUsers = async () => {
        const options = {
            method: "POST"
        }

        let response = await fetch("/api/debug/purgeAllUsers", options)
        if(!response.ok)
            return response.status
        else
            return response.json().then(data => {
                return data
            })
    }
}