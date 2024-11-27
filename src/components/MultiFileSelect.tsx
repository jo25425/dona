"use client";

import React, {ChangeEvent, useState} from "react";
import {useTranslations} from "next-intl";
import {AnonymizationResult, Conversation, DataSourceValue} from "@models/processed";
import {anonymizeData} from "@/services/anonymization";
import {calculateMinMaxDates, filterDataByRange, NullableRange, validateDateRange} from "@services/rangeFiltering";
import {DonationError, getErrorMessage} from "@services/errors";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import AnonymizationPreview from "@components/AnonymizationPreview";
import DateRangePicker from "@components/DateRangePicker";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [anonymizationResult, setAnonymizationResult] = useState<AnonymizationResult | null>(null);
    const [calculatedRange, setCalculatedRange] = useState<NullableRange>([null, null]);
    const [dateRangeError, setDateRangeError] = useState<string | null>(null);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);


    // Handle file selection
    const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setDateRangeError(null);
        setIsLoading(true);

        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFiles(files);

        try {
            const result = await anonymizeData(dataSourceValue, files);
            const { minDate, maxDate } = calculateMinMaxDates(result.anonymizedConversations);
            setAnonymizationResult(result);
            setCalculatedRange([minDate, maxDate]);
            setFilteredConversations(result.anonymizedConversations);
            console.log("anonymizationResult", result);
            onDonatedConversationsChange(result.anonymizedConversations); // Update data for parent
        } catch (err) {
            const errorMessage = getErrorMessage(t, err, { count: selectedFiles.length });
           setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle date range selection
    const handleDateRangeChange = (newRange: NullableRange) => {
        // Validate the selected range
        const errorReason = validateDateRange(anonymizationResult?.anonymizedConversations!, newRange);
        setDateRangeError(errorReason);

        if (!error && anonymizationResult) {
            const filteredConversations = filterDataByRange(anonymizationResult.anonymizedConversations, newRange);
            setFilteredConversations(filteredConversations);
            console.log("anonymizationResult", filteredConversations);
            onDonatedConversationsChange(filteredConversations); // Update parent with filtered data
        }
    };

    return (
        <Box>
            <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                {t('select-data.instruction')}
            </Typography>
            <Button
                variant="contained"
                component="label"
                sx={{ mb: 2 }}
            >
                {selectedFiles.length === 0
                    ? t('select-data.choose')
                    : t('select-data.browse')}
                <input
                    hidden
                    type="file"
                    accept=".txt,.zip"
                    multiple
                    onChange={handleFileSelection}
                />
            </Button>

            {/* Show selected files for feedback */}
            {FilesFeedbackSection(selectedFiles, error)}

            {/* Loading indicator */}
            {isLoading && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                    <Alert severity="info" sx={{ mt: 2 }}>{t('sendData.wait')}</Alert>
                </Box>
            )}

            {/* Display anonymized data */}
            {!error && !isLoading && anonymizationResult && filteredConversations && (
                <Box sx={{mb: 2}}>
                    <DateRangePicker
                        calculatedRange={calculatedRange}
                        setSelectedRange={handleDateRangeChange}
                    />
                    {dateRangeError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{t(`errors.${dateRangeError}`)}</Alert>
                    )}
                    <AnonymizationPreview
                        dataSourceValue={dataSourceValue}
                        anonymizedConversations={filteredConversations}
                        chatMappingToShow={anonymizationResult.chatMappingToShow}
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
                <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>
            )}
        </Box>
    )
};

export default MultiFileSelect;
