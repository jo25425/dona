/**
 * Masks a name by replacing all but the first character of each word with asterisks.
 * Consecutive spaces are reduced to a single space, and leading/trailing spaces are removed.
 *
 * @example
 * maskName("John Doe");
 * // Returns: "Jo** Do*"
 *
 * @example
 * maskName("  Dr. Jane Smith  ");
 * // Returns: "Dr* Ja** Sm***"
 */
export const maskName = (name: string): string => {
    if (!name.trim()) {
        return "";
    }
    return name
        .trim()
        .split(/\s+/)
        .map(word => word.substring(0, 2) + (word.length > 2? "*".repeat(word.length - 2): ""))
        .join(" ");
};

export const decode = (input: string): string => {
    const charCodes = [...input].map((char) => char.charCodeAt(0));
    if (charCodes.every((code) => code <= 127)) return input;

    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(charCodes));
};



