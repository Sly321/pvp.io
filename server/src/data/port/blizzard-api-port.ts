export namespace BlizzardApi {
    export type Realm = {
        // key: {
        //     href: string
        // },
        name: string
        id: number,
        slug: string
    }

    export type Race = {
        // key: {
        //     href: string
        // },
        name: string
        id: number
    }

    export type WoWClass = {
        // key: {
        //     href: string
        // },
        name: string
        id: number
    }

    export type Faction = {
        type: string
        name: string
    }

    // TODO two types
    export type Gender = {
        type: "FEMALE" | "MALE",
        name: "Female" | "Male"
    }

    export type Character = {
        // character: {
        //     href: string
        // },
        // protected_character: {
        //     href: string
        // },
        name: string
        id: number,
        realm: Realm,
        playable_class: WoWClass,
        playable_race: Race,
        gender: Gender,
        faction: Faction,
        level: number
        // _links: any
    }
    
    export type Rating = {
        rating: number,
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

        // TODO: this is not important for this application, so i commented it out for now

        // character: {
        //     name: string
        //     id: number
        //     realm: {
        //         name: string
        //         id: number
        //         slug: string
        //     }
        // },
        // faction: {
        //     type: string
        //     name: string
        // },
        // bracket: {
        //     id: number,
        //     type: string
        // },
        // season: {
        //     id: number
        // },
        // tier: {
        //     id: number
        // },
    }

    export type CharacterWithRating = Character & {
        bracket2v2: Rating
        bracket3v3: Rating
    }

    type FetchRatingOptions = {
        token: string
        realmSlug: string
        bracket: "2v2" | "3v3"
        name: string
    }

    type FetchCharacterOptions = {
        name: string
        realmSlug: string
    }

    type FetchAccountCharacterOptions = {
        token: string
        filter?: (character: BlizzardApi.Character) => boolean
    }

    export interface Port {
        fetchRating: ({ token, realmSlug, bracket, name }: FetchRatingOptions) => Promise<BlizzardApi.Rating>
        fetchCharacter: ({ name, realmSlug }: FetchCharacterOptions) => Promise<Array<BlizzardApi.Character>>
        fetchAccountCharacter: ({ filter, token }: FetchAccountCharacterOptions) => Promise<Array<BlizzardApi.Character>>
    }
}