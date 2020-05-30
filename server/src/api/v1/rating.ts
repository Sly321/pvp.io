import express from "express"
import fetch from "node-fetch"

const rating = express()

const apiUrl = "https://eu.api.blizzard.com/"

interface FetchRatingOptions extends RatingQueryParams {
    token: string
}

type RatingResponseBody = {
    character: {
        name: string
        id: number
        realm: {
            name: string
            id: number
            slug: string
        }
    },
    faction: {
        type: string
        name: string
    },
    bracket: {
        id: number,
        type: string
    },
    rating: number,
    season: {
        id: number
    },
    tier: {
        id: number
    },
    season_match_statistics: {
        played: number,
        won: number,
        lost: number
    },
    weekly_match_statistics: {
        played: number,
        won: number,
        lost: number
    }
}

async function fetchRating({ token, realmSlug, bracket, name }: FetchRatingOptions)  {
    const url = `${apiUrl}profile/wow/character/${realmSlug}/${name}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_US&access_token=${token}`
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
        const rating = await ratingRequest.json() as RatingResponseBody
        return res.send(rating)
    }

    res.send({
        rating: 0,
        season_match_statistics: {
            lost: 0,
            played: 0,
            won: 0
        },
        weekly_match_statistics: {
            lost: 0,
            played: 0,
            won: 0
        }
    } as RatingResponseBody)
})

export default rating

