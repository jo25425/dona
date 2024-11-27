import maskName from "@services/parsing/shared/maskName";

/**
 * Class that generates a map from contact names (e.g. Jane Doe) to pseudonyms (e.g. Contact4)
 */
export class ContactPseudonyms {
    private namesToPseudonyms: Record<string, string> = {};
    private pseudonymsToNames: Record<string, string> = {};
    private counter: number = 1;
    private readonly friendAlias: string;
    private readonly systemAlias?: string;

    constructor(friendAlias: string, systemAlias?: string) {
        this.friendAlias = friendAlias;
        this.systemAlias = systemAlias;
    }

    getPseudonym(name: string): string {
        const decodedName = decode(name);
        if (!this.namesToPseudonyms[decodedName]) {
            const pseudonym = (this.systemAlias && name === this.systemAlias)
                ? this.systemAlias!
                : `${this.friendAlias}${this.counter++}`;
            this.namesToPseudonyms[decodedName] = pseudonym;
            this.pseudonymsToNames[pseudonym] = decodedName;
        }
        return this.namesToPseudonyms[decodedName];
    }

    setPseudonym(name: string, pseudonym: string) {
        const decodedName = decode(name);
        this.namesToPseudonyms[decodedName] = pseudonym;
    }

    getPseudonymMap(): Record<string, string> {
        return this.namesToPseudonyms;
    }

    getOriginalNames(featuredPseudonyms: string[]): string[] {
        return featuredPseudonyms
            .map((pseudonym) => this.pseudonymsToNames[pseudonym])
            .filter((name): name is string => name !== undefined);
    }
}

export class ChatPseudonyms {
    private chatPseudonymToParticipants: Map<string, string[]> = new Map();
    private counter: number = 1;
    private readonly donorAlias: string;
    private readonly chatAlias: string;
    private readonly dataSourceInitial: string;

    constructor(donorAlias: string, chatAlias: string, dataSourceValue: string) {
        this.donorAlias = donorAlias;
        this.chatAlias = chatAlias;
        this.dataSourceInitial = dataSourceValue[0];
    }

    getPseudonym(participants: string[]): string {
        const decodedNames = participants.map(decode);
        const pseudonym = `${this.chatAlias} ${this.dataSourceInitial}${this.counter++}`;
        this.chatPseudonymToParticipants.set(pseudonym, decodedNames.map(maskName));
        return pseudonym;
    }

    setDonorName(donorName: string): void {
        this.chatPseudonymToParticipants.set(this.donorAlias, [donorName]);
    }

    getPseudonymMap(): Map<string, string[]> {
        return this.chatPseudonymToParticipants;
    }

}

const decode = (input: string): string => {
    const charCodes = [...input].map((char) => char.charCodeAt(0));
    if (charCodes.every((code) => code <= 127)) return input;

    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(charCodes));
};
