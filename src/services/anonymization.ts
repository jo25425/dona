import {AnonymizationResult, DataSourceValue} from "@models/processed";
import handleWhatsappTxtFiles from "@services/parsing/whatsapp/whatsappHandler";
import extractTxtFilesFromZip from "@services/parsing/whatsapp/utils/extractTxtFilesFromZip";
import {ValidationErrors} from "@services/validation";

export async function anonymizeData(dataSourceValue: DataSourceValue, files: File[]): Promise<AnonymizationResult> {
    if (files.length == 0) {
        throw ValidationErrors.NoFiles;
    }

    switch (dataSourceValue) {
        default:
        // case DataSourceValue.WhatsApp:
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

            const resultPromise = Promise.all(zipFilesPromises)
                    .then(unzippedFiles => handleWhatsappTxtFiles(txtFiles.concat(unzippedFiles.flat())));
            return resultPromise;
            break;
        // case DataSourceValue.Facebook:
        //     //     resultPromise = facebookZipFileHandler(files);
        //     break;
        // case DataSourceValue.Instagram:
        //     //     resultPromise = instagramZipFileHandler(files);
        //     break;
    }
}
