import express from "express"
import { BlizzardApiAdapter } from "../../data/adapter/blizzard-api"

const characters = express()

characters.get("/api/v1/characters", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }

    try {
        const characters = await BlizzardApiAdapter.fetchAccountCharacter({ 
            token: (req.user as any).token, 
            filter: (c) => c.level === 120 
        })
        res.send(characters)
    } catch(e) {
        console.log("Error in /api/v1/characters")
        console.error(e)   
        res.sendStatus(500)
    }
})

export default characters