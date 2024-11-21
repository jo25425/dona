import {BlobWriter} from "@zip.js/zip.js";
import {parseBlob} from "music-metadata";
import {ValidEntry} from "@services/parsing/shared/zipExtraction";

export default async function calculateAudioLength(audioFile?: ValidEntry): Promise<number> {
    let lengthSeconds: number = -1;
    if (audioFile) {
        try {
            const blobWriter = new BlobWriter();
            const blob = await audioFile.getData(blobWriter);
            const metadata = await parseBlob(blob);
            lengthSeconds = Math.floor(metadata.format.duration || -1);
        } catch (error) {
            console.error("Error processing audio file:", error);
            lengthSeconds = -2;
        }
    }
    return lengthSeconds;
}