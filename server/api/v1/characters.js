const express = require("express")
const getCharacters = express()
const fetch = require("node-fetch")

const url = "https://eu.api.blizzard.com/"

async function fetchCharacters(token)  {
    return fetch(`${url}profile/user/wow?namespace=profile-eu&locale=en_US&access_token=${token}`)
}

getCharacters.get("/api/v1/characters", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }

    const charactersReq = await fetchCharacters(req.user.token)

    if (charactersReq.status === 200) {
        const profile = await charactersReq.json()
        const account = profile.wow_accounts[0]
        const characters = account.characters.filter(char => char.realm.name === "Blackrock")
        return res.send(characters)
    }

    res.sendStatus(500)
})

module.exports = getCharacters