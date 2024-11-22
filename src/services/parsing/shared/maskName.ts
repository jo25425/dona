/**
 * Masks a name by replacing all but the first character of each word with asterisks.
 * Consecutive spaces are reduced to a single space, and leading/trailing spaces are removed.
 *
 * @example
 * maskName("John Doe");
 * // Returns: "J*** D**"
 *
 * @example
 * maskName("  Dr. Jane Smith  ");
 * // Returns: "D** J*** S****"
 */
export default function maskName(name: string): string {
    if (!name.trim()) {
        return "";
    }
    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0] + "*".repeat(word.length - 1))
        .join(" ");
}

