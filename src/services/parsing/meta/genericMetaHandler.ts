import deIdentify from "../shared/deIdentify"; // Adjust import based on your setup
import {DonationError, DonationErrors} from "@services/validation";
import {extractEntriesFromZips, getEntryText, isMatchingEntry, ValidEntry} from "../shared/zipExtraction";
import {AnonymizationResult} from "@models/processed";


export async function handleMetaZipFiles(
    fileList: File[],
    profileInfoFilePattern: string,
    userNameExtractor: (profileText: string) => string
): Promise<AnonymizationResult> {

    const allEntries: ValidEntry[] = await extractEntriesFromZips(fileList);

    // Check for the presence of profile information
    const profileInfoEntry = allEntries.find(entry =>
        isMatchingEntry(entry,profileInfoFilePattern)
    );
    if (!profileInfoEntry) {
        throw new DonationError(DonationErrors.NoProfile);
    }
    // Filter for message entries
    const messageEntries = allEntries.filter(entry =>
        isMatchingEntry(entry, "message.json") || isMatchingEntry(entry, "message_1.json")
    );
    if (messageEntries.length < 1) {
        throw new DonationError(DonationErrors.NoMessageEntries);
    }

    try {
        // Extract donor name from profile
        const donorName = userNameExtractor(await getEntryText(profileInfoEntry));

        // Extract text contents from message entries
        const textList = await Promise.all(messageEntries.map(getEntryText));

        // Process the extracted data
        return deIdentify(donorName, textList, allEntries);

    } catch (error) {
        throw new DonationError(DonationErrors.UnknownError);
    }

}
