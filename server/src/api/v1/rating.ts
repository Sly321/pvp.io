import express from "express"
import { BlizzardApiAdapter } from "../../data/adapter/blizzard-api"

const rating = express()

type RatingQueryParams = {
    realmSlug: string
    bracket: "2v2" | "3v3"
    name: string
}

rating.get<{}, any, any, RatingQueryParams>("/api/v1/rating", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }
    
    const rating = await  BlizzardApiAdapter.fetchRating({
        token: (req.user as any).token, 
        realmSlug: req.query.realmSlug, 
        bracket: req.query.bracket, 
        name: req.query.name
    })

    res.send(rating)
})

export default rating