import React from "react";
import {useTranslations} from "next-intl";
import {AnonymizationResult, DataSourceValue} from "@models/processed";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import CheckIcon from '@mui/icons-material/Check';

interface AnonymizationPreviewProps {
    dataSourceValue: DataSourceValue;
    anonymizationResult: AnonymizationResult;
}

const AnonymizationPreview: React.FC<AnonymizationPreviewProps> = ({ dataSourceValue, anonymizationResult }) => {
    const t = useTranslations('donation');

    return (
        <>
            <Box sx={{my: 1}}>
                <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                    {t('contacts-mapping.title')}
                </Typography>
                <Typography variant="body2">
                    {t(`contacts-mapping.subtitle.${dataSourceValue.toLowerCase()}`)}
                </Typography>
                <TableContainer component={Paper} sx={{mt: 2}}>
                    <Table size="small" aria-label="pseudonyms table">
                        <TableHead>
                            <TableRow sx={{'th': {fontWeight: "bold"}}}>
                                <TableCell>Pseudonym</TableCell>
                                <TableCell>Contacts</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(anonymizationResult.chatMappingToShow.entries()).map(([chatPseudonym, chatParticipants]: [string, string[]]) => (
                                <TableRow
                                    key={chatPseudonym}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">{chatPseudonym}</TableCell>
                                    <TableCell>{chatParticipants.join(", ")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{
                my: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Button>
                    {t('preview-data.button')}
                </Button>
            </Box>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                {t('successful')} {t('preview-data.body2')}
            </Alert>
        </>
    );
};

export default AnonymizationPreview;
