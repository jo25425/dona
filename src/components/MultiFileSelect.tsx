"use client";

import React, {ChangeEvent, useState} from "react";
import {useTranslations} from "next-intl";
import {AnonymizationResult, Conversation, DataSourceValue} from "@models/processed";
import {anonymizeData} from "@/services/anonymization";
import {DonationError, DonationErrors} from "@services/validation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import {calculateMinMaxDates} from "@services/rangeFiltering";
import AnonymizationPreview from "@components/AnonymizationPreview";
import DateRangePicker from "@components/DateRangePicker";

interface MultiFileSelectProps {
    dataSourceValue: DataSourceValue;
    onDonatedConversationsChange: (newDonatedConversations: Conversation[]) => void;
}

type NullableDateRange = [Date | null, Date | null];

const listStyle = {
    p: 0,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};

const MultiFileSelect: React.FC<MultiFileSelectProps> = ({ dataSourceValue, onDonatedConversationsChange }) => {
    const t = useTranslations('donation');

    // States
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);
    const [calculatedRange, setCalculatedRange] = useState<[Date | null, Date | null]>([null, null]);
    const [anonymizationResult, setAnonymizationResult] = useState<AnonymizationResult | null>(null);

    // Handle file selection
    const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
        setError(null);

        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFiles(files); // Local state for file feedback

        // TODO: Message / wheel to signal ongoing processing

        try {
            const data = await anonymizeData(dataSourceValue, files); // Anonymize on selection
            const { minDate, maxDate } = calculateMinMaxDates(data.anonymizedConversations);
            setAnonymizationResult(data);
            setCalculatedRange([minDate, maxDate]);
            onDonatedConversationsChange(data.anonymizedConversations); // Feedback to donation page
        } catch (err) {
            let errorMessage: string;
            if (err instanceof DonationError) {
                switch(err.reason) {
                    case DonationErrors.Not5to7Files:
                        errorMessage = t('errors.Not5to7Files', { count: selectedFiles.length });
                        break;
                    default:
                        errorMessage = t(`errors.${err.reason}`);
                }
            } else {
                errorMessage = "An error occurred during anonymization.";
            }
            setError(errorMessage);
        }
    };

    return (
        <Box>
            <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                {t('select-data.select-header')}
            </Typography>
            {/* TODO: Make input labels language-specific */}
            <TextField
                fullWidth
                type={"file"}
                slotProps={{
                    input: { inputProps: { accept: ".txt,.zip", multiple: true }}
                }}
                onChange={handleFiles}
            />

            {/* Show selected files for feedback */}
            {FilesFeedbackSection(selectedFiles, error)}

            {/* Display anonymized data */}
            {!error && anonymizationResult && (
                <Box sx={{mb: 2}}>
                    <DateRangePicker
                        calculatedRange={calculatedRange}
                        setSelectedRange={setSelectedRange}
                    />
                    <AnonymizationPreview
                        dataSourceValue={dataSourceValue}
                        anonymizationResult={anonymizationResult}
                    />
                </Box>
            )}
        </Box>
    );
};

const FilesFeedbackSection= (
    selectedFiles: File[], errorMessage: string | null
) => {
    return (
        <Box>
            {selectedFiles.length > 0 && (
                <Box sx={{ my: 2 }}>
                    <List sx={listStyle} aria-label="files chosen">
                        {Array.from(selectedFiles).map((file: File, index: number) => (
                            <Box key={index}>
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <InsertDriveFile />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={file.name}
                                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                    />
                                </ListItem>
                                {index < selectedFiles.length - 1 && (
                                    <Divider key={"divider-" + index} component="li" />
                                )}
                            </Box>
                        ))}
                    </List>
                </Box>
            )}

            {/* Error message */}
            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
                </Alert>
            )}
        </Box>
    )
};

export default MultiFileSelect;
