import express from "express"
import fetch from "node-fetch"

const characters = express()

const url = "https://eu.api.blizzard.com/"

async function fetchCharacters(token)  {
    return fetch(`${url}profile/user/wow?namespace=profile-eu&locale=en_US&access_token=${token}`)
}

characters.get("/api/v1/characters", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }

    const charactersReq = await fetchCharacters((req.user as any).token)

    if (charactersReq.status === 200) {
        const profile = await charactersReq.json()
        const account = profile.wow_accounts[0]
        const characters = account.characters.filter(char => char.level === 120)
        return res.send(characters)
    }

    res.sendStatus(500)
})

export default characters