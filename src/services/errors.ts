export enum DonationErrors {
    NoFiles = "NoFiles",
    SameFiles = "SameFiles",
    Not5to7Files = "Not5to7Files",
    TooFewContactsOrMessages = "TooFewContactsOrMessages",
    NoProfile = "NoProfile",
    NoMessageEntries = "NoMessageEntries",
    NoDonorNameFound = "NoDonorNameFound",
    UnknownError = "UnknownError"
}

export enum RangeErrors {
    NonsenseRange = "NonsenseRange",
    NotEnoughMonthsInRange = "NotEnoughMonthsInRange",
    NoMessagesInRange = "NoMessagesInRange"
}

export class DonationError extends Error {
    reason: DonationErrors;

    constructor(reason: DonationErrors) {
        super(reason);
        this.name = this.constructor.name;
        this.reason = reason;
        Object.setPrototypeOf(this, DonationError.prototype);
    }
}

/**
 * Converts an error to a formatted error message using next-intl translations.
 *
 * @param t - The translation function from `useTranslations`.
 * @param error - The error object to interpret.
 * @param formatOptions - Optional dictionary for formatting variables.
 * @returns The formatted error message or a fallback.
 */
export function getErrorMessage(
    t: { (key: string, options?: Record<string, any>): string; has: (key: string) => boolean },
    error: unknown,
    formatOptions?: Record<string, any>
): string {
    if (error instanceof DonationError) {
        const reasonKey = `errors.${error.reason}`;
        const formattedKey = `${reasonKey}_format`;

        if (t.has(formattedKey)) return t(formattedKey, formatOptions);

        if (t.has(reasonKey)) return t(reasonKey);

        return t('errors.UnknownError');
    }

    return t('errors.UnknownError');
}
