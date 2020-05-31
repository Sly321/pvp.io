import { BlizzardApi } from "../port/blizzard-api-port";
import fetch from "node-fetch"

const apiUrl = "https://eu.api.blizzard.com/"

export const BlizzardApiAdapter: BlizzardApi.Port = {
    fetchRating: async ({ token, bracket, name, realmSlug }) => {
        const url = `${apiUrl}profile/wow/character/${realmSlug}/${name}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_US&access_token=${token}`
        const reponse = await fetch(url)

        if (reponse.status === 200) {
            const rating: BlizzardApi.Rating = await reponse.json()
            return {
                rating: rating.rating,
                season_match_statistics: {
                    lost: rating.season_match_statistics.lost,
                    played: rating.season_match_statistics.played,
                    won: rating.season_match_statistics.won
                },
                weekly_match_statistics: {
                    lost: rating.weekly_match_statistics.lost,
                    played: rating.weekly_match_statistics.played,
                    won: rating.weekly_match_statistics.won
                }
            }
        }
    
        return {
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
        }
    },

    fetchAccountCharacter: async ({ filter, token }) => {
        const response = await fetch(`${apiUrl}profile/user/wow?namespace=profile-eu&locale=en_US&access_token=${token}`)
        const profile = await response.json()
        const characters: Array<BlizzardApi.Character> = profile.wow_accounts[0].characters

        if (filter) {
            return characters.filter(filter).map((character: any) => {
                delete character.realm.key
                delete character.playable_class.key
                delete character.playable_race.key
                delete character.protected_character
                delete character.character
                return character
            })
        }

        return characters.map((character: any) => {
            delete character.realm.key
            delete character.playable_class.key
            delete character.playable_race.key
            delete character.protected_character
            delete character.character
            return character
        })
    },

    fetchCharacter: async ({ realmSlug, name }) => {
        throw new Error("not implemented")
    }
}