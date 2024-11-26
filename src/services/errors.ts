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
