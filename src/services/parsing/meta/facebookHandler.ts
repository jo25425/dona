import {DonationError, DonationErrors} from "@services/validation";
import {AnonymizationResult} from "@models/processed";
import {handleMetaZipFiles} from "@services/parsing/meta/genericMetaHandler";


const extractDonorNameFromFacebookProfile = (profileText: string): string => {
    const profileJson = JSON.parse(profileText);

    const profileKey = Object.keys(profileJson).find(key => /profile/.test(key));
    if (profileKey && profileJson[profileKey]?.name?.full_name) {
        return profileJson[profileKey].name.full_name;
    }

    throw new DonationError(DonationErrors.NoDonorNameFound);
}

export default async function handleFacebookZipFiles(fileList: File[]): Promise<AnonymizationResult> {
    return handleMetaZipFiles(
        fileList,
        "profile_information.json",
        extractDonorNameFromFacebookProfile
    );
}
