const express = require("express")
const getRating = express()
const fetch = require("node-fetch")

const apiUrl = "https://eu.api.blizzard.com/"

async function fetchRating({token, realmSlug, bracket, name})  {
    const url = `${apiUrl}profile/wow/character/${realmSlug}/${name}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_US&access_token=${token}`
    // console.log(url)
    return fetch(url)
}

getRating.get("/api/v1/rating", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }

    // console.log("bracket: ", req.param("bracket"))
    // console.log("realmSlug: ", req.param("realmSlug"))
    // console.log("name: ", req.param("name"))
    
    const ratingRequest = await fetchRating({
        token: req.user.token, 
        realmSlug: req.param("realmSlug"), 
        bracket: req.param("bracket"), 
        name: req.param("name")
    })

    // console.log(ratingRequest.status)
    if (ratingRequest.status === 200) {
        const rating = await ratingRequest.json()
        // console.log(rating)
        return res.send(rating)
    }

    res.sendStatus(ratingRequest.status)
})

module.exports = getRating

