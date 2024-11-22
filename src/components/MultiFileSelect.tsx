"use client";

import React, { useState, ChangeEvent } from "react";
import {useTranslations} from "next-intl";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AnonymizationResult, Conversation, DataSourceValue} from "@models/processed";
import {anonymizeData} from "@/services/anonymization";
import {DonationErrors} from "@services/validation";
import AnonymizationSection from "@/components/AnonymizationSection";

interface MultiFileSelectProps {
    dataSourceValue: DataSourceValue;
    onDonatedConversationsChange: (newDonatedConversations: Conversation[]) => void;
}

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
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [anonymizationResult, setAnonymizationResult] = useState<AnonymizationResult | null>(null);

    // Handle file selection
    const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFiles(files); // Local state for file feedback

        try {
            const data = await anonymizeData(dataSourceValue, files); // Anonymize on selection
            setError(null);
            setAnonymizationResult(data);
            // TODO: Use rest of the anonymization result
            onDonatedConversationsChange(data.anonymizedConversations);
        } catch (err) {
            let errorMessage: string;
            switch (true) {
                case err === DonationErrors.Not5to7Files:
                    errorMessage = t('errors.Not5to7Files', { count: selectedFiles.length });
                    break;
                case Object.values(DonationErrors).includes(err as DonationErrors):
                    errorMessage = t(`errors.${err}`);
                    break;
                default:
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

            {/* Show date pickers if validation passes */}
            {!error && selectedFiles.length > 0 && (
                <Box sx={{mb: 2}}>
                    <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                        {t('select-date.choose-period')}
                    </Typography>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                </Box>
            )}

            {/* Display anonymized data */}
            {!error && anonymizationResult && (
                <Box sx={{mb: 2}}>
                    <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                        {t('contacts-mapping.title')}
                    </Typography>
                    <Typography variant="body2">
                        {t(`contacts-mapping.subtitle.${dataSourceValue.toLowerCase()}`)}
                    </Typography>
                    <ul>
                        {Array.from(anonymizationResult.chatMappingToShow.entries()).map(([chatPseudonym, chatParticipants]: [string, string[]]) =>
                            <li key={chatPseudonym}>
                                <Typography variant="body1">{chatPseudonym}: {chatParticipants.join(", ")}</Typography>
                            </li>
                        )}
                    </ul>
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

const DateRangePicker: React.FC<{
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
}> = ({ startDate, endDate, setStartDate, setEndDate }) => {
    const t = useTranslations('donation.select-date');
    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={6}>
                <Typography variant="body2">{t('start')}</Typography>
                <DatePicker
                    showIcon
                    selected={startDate}
                    onChange={setStartDate}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="dd.MM.yyyy"
                    customInput={<TextField />}
                />
            </Grid>
            <Grid size={6}>
                <Typography variant="body2">{t('end')}</Typography>
                <DatePicker
                    showIcon
                    selected={endDate}
                    onChange={setEndDate}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="dd.MM.yyyy"
                    customInput={<TextField />}
                />
            </Grid>
        </Grid>
    )
};

export default MultiFileSelect;
