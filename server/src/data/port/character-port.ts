import { Port } from "./common-port";

type Character = {

}

export interface CharacterPort extends Port {
    save: (character: Character) => Promise<void>
    load: ({ realm, name }: { realm: string, name: string }) => Promise<Character>
}