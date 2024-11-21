import deIdentify from "./deIdentify";
import {DonationError, DonationErrors} from "@services/validation";
import {
    extractEntriesFromZips,
    getEntryText,
    isMatchingEntry,
    ValidEntry
} from "@services/parsing/shared/zipExtraction";
import {AnonymizationResult, DataSourceValue} from "@models/processed";

interface ParsedMessage {
    sender_name: string;
    content?: string;
    audio_files?: { uri: string }[];
    timestamp_ms: number;
}

export interface ParsedConversation {
    participants: { name: string; }[];
    messages: ParsedMessage[];
    [key: string]: any;
}

export async function handleInstagramZipFiles(fileList: File[]): Promise<AnonymizationResult> {
    return handleMetaZipFiles(
        fileList,
        "personal_information.json",
        extractDonorNameFromInstagramProfile,
        DataSourceValue.Instagram
    );
}

export async function handleFacebookZipFiles(fileList: File[]): Promise<AnonymizationResult> {
    return handleMetaZipFiles(
        fileList,
        "profile_information.json",
        extractDonorNameFromFacebookProfile,
        DataSourceValue.Facebook
    );
}

const extractDonorNameFromFacebookProfile = (profileText: string): string => {
    const profileJson = JSON.parse(profileText);

    const profileKey = Object.keys(profileJson).find(key => /profile/.test(key));
    if (profileKey && profileJson[profileKey]?.name?.full_name) {
        return profileJson[profileKey].name.full_name;
    }

    throw new DonationError(DonationErrors.NoDonorNameFound);
}

const extractDonorNameFromInstagramProfile = (profileText: string): string => {
    interface ProfileUser {
        string_map_data: {
            Name: { value: string };
        };
    }

    interface ProfileInfo {
        profile_user: ProfileUser[];
    }

    const profileJson: ProfileInfo = JSON.parse(profileText);

    const name = profileJson?.profile_user?.[0]?.string_map_data?.Name?.value;
    if (!name) {
        return name;
    }

    throw new DonationError(DonationErrors.NoDonorNameFound);
}

async function handleMetaZipFiles(
    fileList: File[],
    profileInfoFilePattern: string,
    userNameExtractor: (profileText: string) => string,
    dataSourceValue: DataSourceValue
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
    // Select audio entries
    const audioEntries = allEntries.filter(entry => isMatchingEntry(entry, ".wav"));

    try {
        // Extract donor name from profile
        const donorName = userNameExtractor(await getEntryText(profileInfoEntry));

        // Extract message contents from message entries
        const parsedConversations = await getConversationsFromEntries(messageEntries)

        // Process the extracted data
        return deIdentify(parsedConversations, audioEntries, dataSourceValue);

    } catch (error) {
        throw new DonationError(DonationErrors.UnknownError);
    }
}

const getConversationsFromEntries = async (messageEntries: ValidEntry[]): Promise<ParsedConversation[]> => {
    const textList = await Promise.all(messageEntries.map(getEntryText));
    const jsonContents: Map<string, ParsedConversation> = new Map();

    textList.forEach((textContent) => {
        const jsonContent: ParsedConversation = JSON.parse(textContent);
        if (jsonContents.has(jsonContent.thread_path)) {
            jsonContents.get(jsonContent.thread_path)!.messages.push(...jsonContent.messages);
        } else {
            jsonContents.set(jsonContent.thread_path, jsonContent);
        }
    });
    return Object.values(jsonContents);
}
