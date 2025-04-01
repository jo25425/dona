"use client";

import React, {ChangeEvent, useState} from "react";
import {useTranslations} from "next-intl";
import {AnonymizationResult, Conversation, DataSourceValue} from "@models/processed";
import {anonymizeData} from "@/services/anonymization";
import {calculateMinMaxDates, filterDataByRange, NullableRange, validateDateRange} from "@services/rangeFiltering";
import {getErrorMessage} from "@services/errors";
import Alert, {AlertProps} from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AnonymizationPreview from "@components/AnonymizationPreview";
import DateRangePicker from "@components/DateRangePicker";
import LoadingSpinner from "@components/LoadingSpinner";
import {FileList, FileUploadButton} from "@components/DonationComponents";
import styled from "@mui/material/styles/styled";


const UploadAlert = styled((props: AlertProps) => (
    <Alert severity="error" {...props} />
))(({theme}) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
}));

interface MultiFileSelectProps {
    dataSourceValue: DataSourceValue;
    onDonatedConversationsChange: (newDonatedConversations: Conversation[]) => void;
    onDonationChatsChange: (newDonationChats: Set<string>) => void;
    onFeedbackChatsChange: (newFeedbackChats: Set<string>) => void;
}

const MultiFileSelect: React.FC<MultiFileSelectProps> = ({dataSourceValue, onDonatedConversationsChange, onDonationChatsChange, onFeedbackChatsChange}) => {
    const t = useTranslations('donation');
    const acceptedFileTypes = (
        dataSourceValue == DataSourceValue.WhatsApp ? ".txt, .zip" :
            dataSourceValue == DataSourceValue.IMessage ? ".db" :
                ".zip"
    );

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
            const {minDate, maxDate} = calculateMinMaxDates(result.anonymizedConversations);
            setAnonymizationResult(result);
            setCalculatedRange([minDate, maxDate]);
            setFilteredConversations(result.anonymizedConversations);
            onDonatedConversationsChange(result.anonymizedConversations); // Update data for parent
        } catch (err) {
            const errorMessage = getErrorMessage(t, err as Error, {count: selectedFiles.length});
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
            onDonatedConversationsChange(filteredConversations); // Update parent with filtered data
        }
    };

    return (
        <Box>
            <Typography sx={{fontWeight: "bold"}} gutterBottom>
                {t('select-data.instruction')}
            </Typography>
            <FileUploadButton
                onChange={handleFileSelection}
                loading={isLoading}
                accept={acceptedFileTypes}
            />

            {/* Show selected files for feedback */}
            {selectedFiles.length > 0 && (
                <Box sx={{my: 3, width: '100%'}}>
                    <FileList files={selectedFiles}/>
                    {error && <UploadAlert>{error}</UploadAlert>}
                </Box>
            )}

            {/* Loading indicator */}
            {isLoading && <LoadingSpinner message={t('sendData.wait')}/>}

            {/* Display anonymized data */}
            {!error && !isLoading && anonymizationResult && filteredConversations && (
                <Box sx={{my: 3}}>
                    <DateRangePicker
                        calculatedRange={calculatedRange}
                        setSelectedRange={handleDateRangeChange}
                    />
                    {dateRangeError && <UploadAlert>{t(`errors.${dateRangeError}`)}</UploadAlert>}
                    <AnonymizationPreview
                        dataSourceValue={dataSourceValue}
                        anonymizedConversations={filteredConversations}
                        chatMappingToShow={anonymizationResult.chatMappingToShow}
                        onSelectedChatsChange={onDonationChatsChange}
                        onFeedbackChatsChange={onFeedbackChatsChange}
                    />
                </Box>
            )}
        </Box>
    );
};

export default MultiFileSelect;

