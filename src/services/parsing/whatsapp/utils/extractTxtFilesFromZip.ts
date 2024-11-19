import JSZip from 'jszip';

function extractTxtFilesFromZip(file: File): Promise<File[]> {
    return new Promise((resolve, reject) => {
        JSZip.loadAsync(file)
            .then((zip) => {
                const txtFiles: Promise<File | null>[] = [];

                Object.keys(zip.files).forEach((filename) => {
                    txtFiles.push(
                        zip.files[filename].async('blob').then((fileData) => {
                            if (filename.endsWith(".txt")) {
                                return new File([fileData], filename);
                            }
                            return null;
                        })
                    );
                });

                Promise.all(txtFiles)
                    .then((files) => resolve(files.filter((file): file is File => file !== null)))
                    .catch(reject);
            })
            .catch(reject);
    });
}

export default extractTxtFilesFromZip;
