import { BlizzardApi } from "../port/blizzard-api-port";
import fetch from "node-fetch"
import { Log } from "../../utils/log";

const apiUrl = "https://eu.api.blizzard.com/"

export const BlizzardApiAdapter: BlizzardApi.Port = {
    fetchRating: async ({ token, bracket, name, realmSlug }) => {
        const url = `${apiUrl}profile/wow/character/${realmSlug}/${name}/pvp-bracket/${bracket}?namespace=profile-eu&locale=en_US&access_token=${token}`
        const response = await fetch(url)

        Log.http(url, "requesting", response.status)

        if (response.status === 200) {
            const rating: BlizzardApi.Rating = await response.json()
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
        const url = `${apiUrl}profile/user/wow?namespace=profile-eu&locale=en_US&access_token=${token}`;
        const response = await fetch(url)
        Log.http(url, "requesting", response.status)
        
        const profile: { wow_accounts: Array<{ id: number, characters: Array<BlizzardApi.Character> }>} = await response.json()
        Log.debug({"profile.wow_accounts.length": profile.wow_accounts.length})

        let characters: Array<BlizzardApi.Character> = []

        if (profile.wow_accounts.length === 1) {
            characters = profile.wow_accounts[0].characters
        } else if (profile.wow_accounts.length > 1) {
            Log.info("found more than 1 wow account, choosing the one with more max level characters")
            Log.debug(JSON.stringify(profile.wow_accounts, null , 2));

            let numberOfMaxLevelCharacters = 0
            profile.wow_accounts.forEach((account, index) => {
                const chars = account.characters.filter((char => char.level === 120))
                Log.debug("account at index " + index + " has " + chars.length + " max level characters")
                if (chars.length > numberOfMaxLevelCharacters) {
                    numberOfMaxLevelCharacters = chars.length
                    Log.debug("choose account index " + index + " because it has " + numberOfMaxLevelCharacters + " max level characters.")
                    characters = account.characters
                }
            });
        }

        if (filter) {
            const filteredCharacters = characters.filter(filter).map((character: any) => {
                delete character.realm.key;
                delete character.playable_class.key;
                delete character.playable_race.key;
                delete character.protected_character;
                delete character.character;
                return character;
            });

            Log.info("fetchAccountCharacter", "returning " + filteredCharacters.length + " characters")

            return filteredCharacters
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