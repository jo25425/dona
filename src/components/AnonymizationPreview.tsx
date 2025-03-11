import React from "react";
import {useTranslations} from "next-intl";
import {ChatMapping, Conversation, DataSourceValue} from "@models/processed";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AnonymizationModal from "@components/AnonymizationModal";
import CheckIcon from '@mui/icons-material/Check';
import styled from "@mui/material/styles/styled";

const ResponsiveTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

interface AnonymizationPreviewProps {
    dataSourceValue: DataSourceValue;
    anonymizedConversations: Conversation[];
    chatMappingToShow: ChatMapping;
}

const AnonymizationPreview: React.FC<AnonymizationPreviewProps> = (
    {dataSourceValue, anonymizedConversations, chatMappingToShow}
) => {
    const t = useTranslations("donation");
    const [isModalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <Box sx={{ my: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                {t("contacts-mapping.title")}
            </Typography>
            <Typography variant="body2">
                {t(`contacts-mapping.subtitle.${dataSourceValue.toLowerCase()}`)}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small" aria-label="pseudonyms table">
                    <TableHead>
                        <TableRow sx={{ "th": { fontWeight: "bold" } }}>
                            <ResponsiveTableCell>{t('contacts-mapping.pseudonyms')}</ResponsiveTableCell>
                            <ResponsiveTableCell>{t('contacts-mapping.contacts')}</ResponsiveTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(chatMappingToShow.entries()).map(([chatPseudonym, chatParticipants]) => (
                            <TableRow
                                key={chatPseudonym}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <ResponsiveTableCell component="th" scope="row">{chatPseudonym}</ResponsiveTableCell>
                                <ResponsiveTableCell>{chatParticipants.join(", ")}</ResponsiveTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button onClick={handleOpenModal}>{t("preview-data.button")}</Button>
            </Box>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                {t('successful')} {t('preview-data.body2')}
            </Alert>

            <AnonymizationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                conversations={anonymizedConversations}
                n_listed_receivers={3}
                n_messages={100}
            />
        </Box>
    );
};

export default AnonymizationPreview;
