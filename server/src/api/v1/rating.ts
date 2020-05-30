import express from "express"
import fetch from "node-fetch"

const rating = express()

const apiUrl = "https://eu.api.blizzard.com/"

interface FetchRatingOptions extends RatingQueryParams {
    token: string
}

async function fetchRating({ token, realmSlug, bracket, name }: FetchRatingOptions)  {
    const url = `${apiUrl}profile/wow/character/${realmSlug}/${name}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_US&access_token=${token}`
    // console.log(url)
    return fetch(url)
}

type RatingQueryParams = {
    realmSlug: string
    bracket: string
    name: string
}

rating.get<{}, any, any, RatingQueryParams>("/api/v1/rating", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }
    
    const ratingRequest = await fetchRating({
        token: (req.user as any).token, 
        realmSlug: req.query.realmSlug, 
        bracket: req.query.bracket, 
        name: req.query.name
    })

    if (ratingRequest.status === 200) {
        const rating = await ratingRequest.json()
        return res.send(rating)
    }

    res.sendStatus(ratingRequest.status)
})

export default rating

