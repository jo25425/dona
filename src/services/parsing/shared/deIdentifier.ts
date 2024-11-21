class DeIdentifier {
    private namesToPseudonyms: Record<string, string> = {};
    private counter: number = 1;
    private readonly friendAlias: string;
    private readonly systemAlias?: string;

    constructor(friendAlias: string, systemAlias?: string) {
        this.friendAlias = friendAlias;
        this.systemAlias = systemAlias;
    }

    decode(input: string): string {
        const charCodes = [...input].map((char) => char.charCodeAt(0));
        if (charCodes.every((code) => code <= 127)) return input;

        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(charCodes));
    }

    getDeIdentifiedId(name: string): string {
        const decodedName = this.decode(name);
        if (!this.namesToPseudonyms[decodedName]) {
            this.namesToPseudonyms[decodedName] = (this.systemAlias && name === this.systemAlias)
                ? this.systemAlias!
                : `${this.friendAlias}${this.counter++}`;
        }
        return this.namesToPseudonyms[decodedName];
    }

    setPseudonym(name: string, pseudonym: string) {
        const decodedName = this.decode(name);
        this.namesToPseudonyms[decodedName] = pseudonym;
    }

    getPseudonymMap(): Record<string, string> {
        return this.namesToPseudonyms;
    }
}
