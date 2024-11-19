/*
Enumeration corresponding to the following errors, as explained in the English UI:
 - "same-file": "You can only select files that differ. Please choose your 5-7 most important conversations.",
 - "not-enough-chats_format": "Please choose your 5-7 most important conversations. You have selected {count}. Press and hold the ctrl/command key to select multiple files at the same time.",
 - "emptyOrJustOnePerson": "All your chats should contain at least 100 messages and at least one contact (other than yourself)."
 - "no-profile": "The uploaded data does not include profile information.",
 - "somewhereError": "There is an error somewhere. Please check your data donation.",

 - "no-alias": "Please enter your username. You can find it in your WhatsApp profile.",
 - "something-went-wrong": "Something went wrong! Please go back to the start and repeat the process.",
 - "no-messages-time-period": "There are no messages in the selected period. Please select a longer and valid period.",
 - "dates-no-sense": "The selected period is not valid. Please check the correctness of the selected dates.",
 - "dates-not-enough-months": "To donate your data, please select a period of at least 6 months within the period of your donation.",
 */
export enum DonationErrors {
    NoFiles = "NoFiles",
    SameFiles = "SameFiles",
    Not5to7Files = "Not5to7Files",
    EmptyOrOneContact = "EmptyOrOneContact",
    NoProfile = "NoProfile",
    NoMessageEntries = "NoMessageEntries",
    NoDonorNameFound = "NoDonorNameFound",
    UnknownError = "UnknownError"
}

// Custom validation error class matches the error values defined above
export class DonationError extends Error {
    reason: DonationErrors;

    constructor(reason: DonationErrors) {
        super(reason);
        this.name = this.constructor.name;
        this.reason = reason;
        Object.setPrototypeOf(this, DonationError.prototype);
    }
}
