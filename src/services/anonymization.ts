export const anonymize_data = (files: File[]): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        try {
            const anonymizedData: string[] = [];

            files.forEach((file) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const fileContent = e.target?.result as string;

                    // Dummy anonymization
                    // Example: remove phone numbers or names
                    const anonymizedContent = fileContent.replace(/(\d{10,})/g, "[ANONYMIZED]"); // Simple example to replace numbers
                    anonymizedData.push(anonymizedContent);

                    if (anonymizedData.length === files.length) {
                        resolve(anonymizedData);
                    }
                };

                reader.onerror = () => reject("Error reading file");
                reader.readAsText(file);
            });
        } catch (error) {
            reject(error);
        }
    });
};
