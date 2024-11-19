import {BlobReader, Entry, TextWriter, ZipReader} from "@zip.js/zip.js";


// Custom type for entries with getData
export interface ValidEntry extends Entry {
    getData: (writer: TextWriter) => Promise<any>;
}

// Type guard to check for valid entries
const isValidEntry = (entry: Entry): entry is ValidEntry =>
    typeof entry.getData === "function";

// Check that entry name matches the pattern provided
const isMatchingEntry = (entry: Entry, contentPattern: string): boolean =>
    entry.filename.trim().includes(contentPattern);

const getEntryText = (entry: ValidEntry): Promise<string> =>
    entry.getData(new TextWriter());

async function extractTxtFilesFromZip(file: File): Promise<File[]> {
    const zipReader = new ZipReader(new BlobReader(file));
    const entries = await zipReader.getEntries();
    await zipReader.close();

    const txtFiles: File[] = [];

    for (const entry of entries) {
        if (isValidEntry(entry) && entry.filename.endsWith(".txt")) {
            const content = await getEntryText(entry);
            txtFiles.push(new File([content], entry.filename));
        }
    }

    return txtFiles;
}

async function extractEntriesFromZips(files: File[]): Promise<ValidEntry[]> {
    let allEntries: Entry[] = [];

    for (const file of files) {
        const zipFileReader = new BlobReader(file);
        const zipReader = new ZipReader(zipFileReader);
        allEntries.push(...await zipReader.getEntries());
        await zipReader.close();
    }
    return allEntries.filter(isValidEntry);
}



export {extractTxtFilesFromZip, extractEntriesFromZips, getEntryText, isMatchingEntry};
