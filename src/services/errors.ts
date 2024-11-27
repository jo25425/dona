export enum DonationErrors {
    NoFiles = "NoFiles",
    SameFiles = "SameFiles",
    Not5to7Files = "Not5to7Files",
    TooFewContactsOrMessages = "TooFewContactsOrMessages",
    NoProfile = "NoProfile",
    NoMessageEntries = "NoMessageEntries",
    NoDonorNameFound = "NoDonorNameFound",
    TransactionFailed = "TransactionFailed",
    UnknownError = "UnknownError"
}

export enum RangeErrors {
    NonsenseRange = "NonsenseRange",
    NotEnoughMonthsInRange = "NotEnoughMonthsInRange",
    NoMessagesInRange = "NoMessagesInRange"
}

export class DonationError extends Error {
    public readonly reason: DonationErrors;
    public readonly context?: Record<string, any>;

    constructor(reason: DonationErrors, context?: Record<string, any>) {
        super(reason);
        this.name = 'DonationError';
        this.reason = reason;
        this.context = context;
    }
}

export class DonationValidationError extends DonationError {
    constructor(reason: DonationErrors, context?: Record<string, any>) {
        super(reason, context);
        this.name = 'DonationValidationError';
    }
}

// Processing-specific error
export class DonationProcessingError extends DonationError {
    constructor(reason: DonationErrors, context?: Record<string, any>) {
        super(reason, context);
        this.name = 'DonationProcessingError';
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
