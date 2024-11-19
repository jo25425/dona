import {AnonymizationResult, DataSourceValue} from "@models/processed";
import handleWhatsappTxtFiles from "@services/parsing/whatsapp/whatsappHandler";
import {extractTxtFilesFromZip} from "@services/parsing/shared/zipExtraction";
import {DonationErrors} from "@services/validation";
import handleInstagramZipFiles from "@services/parsing/meta/instagramHandler";
import handleFacebookZipFiles from "@services/parsing/meta/facebookHandler";

export async function anonymizeData(dataSourceValue: DataSourceValue, files: File[]): Promise<AnonymizationResult> {
    if (files.length == 0) {
        throw DonationErrors.NoFiles;
    }

    let resultPromise;
    switch (dataSourceValue) {
        case DataSourceValue.WhatsApp:
            const txtFiles: File[] = [];
            const zipFilesPromises: Promise<File[]>[] = [];

            // Separate text files and handle zip files
            files.forEach(file => {
                if (file.type === "text/plain") {
                    txtFiles.push(file);
                } else {
                    zipFilesPromises.push(extractTxtFilesFromZip(file));
                }
            });

            resultPromise = Promise.all(zipFilesPromises)
                .then(unzippedFiles => handleWhatsappTxtFiles(txtFiles.concat(unzippedFiles.flat())));
            break;
        case DataSourceValue.Facebook:
            resultPromise = handleFacebookZipFiles(files);
            break;
        case DataSourceValue.Instagram:
            resultPromise = handleInstagramZipFiles(files);
            break;
    }
    return resultPromise;
}
