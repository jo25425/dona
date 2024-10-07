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
import "react-datepicker/dist/react-datepicker.css"; // import datepicker styles

interface MultiFileSelectProps {
    onFileChange: (files: File[]) => void;
}

const listStyle = {
    p: 0,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};

const MultiFileSelect: React.FC<MultiFileSelectProps> = ({ onFileChange }) => {
    const t = useTranslations('donation');

    // States
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Validation logic
    const validateFiles = (files: File[]) => {
        const fileNames = files.map(file => file.name);
        const uniqueFileNames = new Set(fileNames);

        if (files.length < 5 || files.length > 7) {
            setValidationError(
                t('errors.not-enough-chats_format', { count: files.length })
            );
        } else if (uniqueFileNames.size !== files.length) {
            setValidationError(t('errors.same-file'));
        } else {
            setValidationError(null); // No errors
        }
    };

    // Handle file selection
    const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFiles(files); // Local state for file feedback
        onFileChange(files);     // Pass the files up to the parent

        // Run validation on selected files
        validateFiles(files);
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
            {FilesFeedbackSection(selectedFiles, validationError)}

            {/* Show date pickers if validation passes */}
            {!validationError && selectedFiles.length > 0 && (
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            )}
        </Box>
    );
};

const FilesFeedbackSection= (
    selectedFiles: File[], validationError: string | null
) => {
    return (
        <Box>
            {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
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
                                    <Divider component="li" />
                                )}
                            </Box>
                        ))}
                    </List>
                </Box>
            )}

            {/* Validation error message */}
            {validationError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    <span dangerouslySetInnerHTML={{ __html: validationError }} />
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
    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={6}>
                <Typography variant="body2">Start Date</Typography>
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
                <Typography variant="body2">End Date</Typography>
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
