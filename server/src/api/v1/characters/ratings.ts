import express from "express"
import { BlizzardApiAdapter } from "../../../data/adapter/blizzard-api"
import { BlizzardApi } from "../../../data/port/blizzard-api-port";

const charactersRatings = express()

type Meta = {
    season: {
        bracket2v2: {
            overallPlayed: number
            classes: Array<{ 
                playableClass: string,
                played: number,
                won: number
            }>
        }
    }
}

function createMeta(characters: Array<BlizzardApi.CharacterWithRating>): Meta {
    const meta: Meta = {
        season: {
            bracket2v2: {
                overallPlayed: 0,
                classes: []
            }
        }
    }

    characters.forEach(character => {
        meta.season.bracket2v2.overallPlayed += character.bracket2v2.season_match_statistics.played
        
        const find = meta.season.bracket2v2.classes.find(e => e.playableClass === character.playable_class.name)
        if (find) {
            find.played += character.bracket2v2.season_match_statistics.played
            find.won += character.bracket2v2.season_match_statistics.played
        } else {
            meta.season.bracket2v2.classes.push({
                playableClass: character.playable_class.name,
                played: character.bracket2v2.season_match_statistics.played,
                won: character.bracket2v2.season_match_statistics.won
            })
        }
    })

    return meta
}

charactersRatings.get("/api/v1/characters/ratings", async function(req, res) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401)
    }

    if (process.env.MOCK_DATA) {
        const meta = createMeta(ShowcaseData)
        return res.send({
            characters: ShowcaseData,
            meta
        })
    }

    const token = (req.user as any).token

    try {
        const characters = await BlizzardApiAdapter.fetchAccountCharacter({
            token,
            filter: (c) => c.level === 120
        })
        
        const charactersWithRating = await Promise.all(characters.map<Promise<BlizzardApi.CharacterWithRating>>(async (character) => {
            const bracket2v2 = await BlizzardApiAdapter.fetchRating({
                token,
                bracket: "2v2",
                name: character.name.toLocaleLowerCase(),
                realmSlug: character.realm.slug
            })

            const bracket3v3 = await BlizzardApiAdapter.fetchRating({
                token,
                bracket: "3v3",
                name: character.name.toLocaleLowerCase(),
                realmSlug: character.realm.slug
            })

            return {
                ...character,
                bracket2v2,
                bracket3v3
            } as BlizzardApi.CharacterWithRating
        }))

        const meta = createMeta(charactersWithRating)

        res.send({
            characters: charactersWithRating,
            meta
        })
    } catch(e) {
        console.log("Error in /api/v1/characters/ratings")
        console.error(e)   
        res.sendStatus(500)
    }
})

export default charactersRatings

const HORDE: BlizzardApi.Faction = { 
    type: "HORDE",
    name: "Horde"
}

const MALE: BlizzardApi.Gender = {
    type: "MALE",
    name: "Male"
}

const ORC: BlizzardApi.Race = {
    id: 2,
    name: "Orc"
}

function createStats(won: number, lost: number) {
    return {
        played: won + lost,
        won: won,
        lost: lost
    }
}

const Guldan: BlizzardApi.CharacterWithRating = {
    name: "Guldan",
    id: 1,
    level: 120,
    playable_class: {
        id: 9,
        name: "Warlock"
    },
    realm: {
        name: "Blackrock",
        slug: "blackrock",
        id: 1
    },
    playable_race: ORC,
    faction: HORDE,
    gender: MALE,
    bracket2v2: {
        rating: 2541,
        season_match_statistics: createStats(140, 70),
        weekly_match_statistics: createStats(20, 10)
    },
    bracket3v3: {
        rating: 2301,
        season_match_statistics: createStats(82, 57),
        weekly_match_statistics: createStats(12, 5)
    }
}

export const ShowcaseData: Array<BlizzardApi.CharacterWithRating> = [
    Guldan
]