import {DonationError, DonationErrors} from "@services/validation";
import {AnonymizationResult} from "@models/processed";
import {handleMetaZipFiles} from "@services/parsing/meta/genericMetaHandler";


interface ProfileUser {
    string_map_data: {
        Name: { value: string };
    };
}

interface ProfileInfo {
    profile_user: ProfileUser[];
}

const extractDonorNameFromInstagramProfile = (profileText: string): string => {
    const profileJson: ProfileInfo = JSON.parse(profileText);

    const name = profileJson?.profile_user?.[0]?.string_map_data?.Name?.value;
    if (!name) {
        return name;
    }

    throw new DonationError(DonationErrors.NoDonorNameFound);
}

export default async function handleInstagramZipFiles(fileList: File[]): Promise<AnonymizationResult> {
    return handleMetaZipFiles(
        fileList,
        "personal_information.json",
        extractDonorNameFromInstagramProfile
    );
}