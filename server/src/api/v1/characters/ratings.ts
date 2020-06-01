import express from "express"
import { BlizzardApiAdapter } from "../../../data/adapter/blizzard-api"
import { BlizzardApi } from "../../../data/port/blizzard-api-port";
import { Log } from "../../../utils/log";

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
    Log.info("create meta")
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

    Log.info("return meta")
    return meta
}

charactersRatings.get("/api/v1/characters/ratings", async function(req, res) {
    Log.http("/api/v1/characters/ratings", "requested")

    if (!req.isAuthenticated()) {
        Log.http("/api/v1/characters/ratings", "send", 401)
        return res.sendStatus(401)
    }

    Log.debug(req.user)

    if (process.env.MOCK_DATA) {
        Log.debug("process.env.MOCK_DATA", process.env.MOCK_DATA)
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

        Log.http("/api/v1/characters/ratings", "send", 200)
        
        const result = {
            characters: charactersWithRating,
            meta
        };

        Log.debug(result)
        res.send(result)
    } catch(e) {
        Log.error(e)
        Log.http("/api/v1/characters/ratings", "send", 500)
        res.sendStatus(500)
    }
})

export default charactersRatings

const HORDE: BlizzardApi.Faction = { 
    type: "HORDE",
    name: "Horde"
}

const ALLIANCE: BlizzardApi.Faction = { 
    type: "ALLIANCE",
    name: "Alliance"
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

function createRealm(name: string): BlizzardApi.Realm {
    return {
        name,
        slug: name.toLocaleLowerCase(),
        id: 1
    }
}

const Guldan = createCwr("Guldan", HORDE, "Warlock", {
    bracket2v2: {
        rating: 2841,
        season_match_statistics: createStats(140, 70),
        weekly_match_statistics: createStats(20, 10)
    },
    bracket3v3: {
        rating: 2601,
        season_match_statistics: createStats(82, 57),
        weekly_match_statistics: createStats(12, 5)
    }
})

const Valeera = createCwr("Valeera", HORDE, "Rogue", {
    bracket2v2: {
        rating: 2341,
        season_match_statistics: createStats(132, 89),
        weekly_match_statistics: createStats(19, 4)
    },
    bracket3v3: {
        rating: 2601,
        season_match_statistics: createStats(122, 40),
        weekly_match_statistics: createStats(0, 0)
    }
})

const Uther = createCwr("Uther", ALLIANCE, "Paladin", {
    bracket2v2: {
        rating: 2132,
        season_match_statistics: createStats(145, 59),
        weekly_match_statistics: createStats(51, 19)
    },
    bracket3v3: {
        rating: 1923,
        season_match_statistics: createStats(132, 89),
        weekly_match_statistics: createStats(8, 12)
    }
})

const Arthas = createCwr("Arthas", ALLIANCE, "Death Knight", {
    bracket2v2: {
        rating: 1902,
        season_match_statistics: createStats(140, 70),
        weekly_match_statistics: createStats(20, 10)
    },
    bracket3v3: {
        rating: 2451,
        season_match_statistics: createStats(82, 57),
        weekly_match_statistics: createStats(12, 5)
    }
})

const Illidan = createCwr("Illidan", HORDE, "Demon Hunter", {
    bracket2v2: {
        rating: 1783,
        season_match_statistics: createStats(140, 70),
        weekly_match_statistics: createStats(20, 10)
    },
    bracket3v3: {
        rating: 1502,
        season_match_statistics: createStats(82, 57),
        weekly_match_statistics: createStats(12, 5)
    }
})

const Thrall = createCwr("Thrall", HORDE, "Shaman", {
    bracket2v2: {
        rating: 1654,
        season_match_statistics: createStats(140, 70),
        weekly_match_statistics: createStats(20, 10)
    },
    bracket3v3: {
        rating: 1452,
        season_match_statistics: createStats(82, 57),
        weekly_match_statistics: createStats(12, 5)
    }
})

const Rexxar = createCwr("Rexxar", HORDE, "Hunter", {
    bracket2v2: {
        rating: 1494,
        season_match_statistics: createStats(30, 32),
        weekly_match_statistics: createStats(0, 0)
    },
    bracket3v3: {
        rating: 1653,
        season_match_statistics: createStats(43, 38),
        weekly_match_statistics: createStats(2, 1)
    }
})

const Jaina = createCwr("Jaina", ALLIANCE, "Mage", {
    bracket2v2: {
        rating: 2694,
        season_match_statistics: createStats(154, 64),
        weekly_match_statistics: createStats(4, 2)
    },
    bracket3v3: {
        rating: 2452,
        season_match_statistics: createStats(143, 51),
        weekly_match_statistics: createStats(12, 5)
    }
})

const Malfurion = createCwr("Malfurion", ALLIANCE, "Druid", {
    bracket2v2: {
        rating: 1240,
        season_match_statistics: createStats(12, 2),
        weekly_match_statistics: createStats(0, 0)
    },
    bracket3v3: {
        rating: 1420,
        season_match_statistics: createStats(16, 4),
        weekly_match_statistics: createStats(2, 1)
    }
})

const Tyrande = createCwr("Tyrande", ALLIANCE, "Priest", {
    bracket2v2: {
        rating: 2342,
        season_match_statistics: createStats(63, 2),
        weekly_match_statistics: createStats(31, 1)
    },
    bracket3v3: {
        rating: 2214,
        season_match_statistics: createStats(52, 4),
        weekly_match_statistics: createStats(12, 1)
    }
})


function createCwr(name: string, faction: BlizzardApi.Faction, playableClass: string, rating: { bracket2v2: BlizzardApi.Rating, bracket3v3: BlizzardApi.Rating }, gender: BlizzardApi.Gender = MALE, playable_race: BlizzardApi.Race = ORC): BlizzardApi.CharacterWithRating {
    return {
        name,
        id: 1,
        level: 120,
        playable_class: {
            id: 9,
            name: playableClass
        },
        realm: createRealm("Blackrock"),
        playable_race,
        faction,
        gender,
        bracket2v2: rating.bracket2v2,
        bracket3v3: rating.bracket3v3
    }
}

export const ShowcaseData: Array<BlizzardApi.CharacterWithRating> = [
    Guldan, Valeera, Uther, Arthas, Illidan, Thrall, Rexxar, Jaina, Malfurion, Tyrande
]