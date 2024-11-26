import React from "react";
import {useTranslations} from "next-intl";
import {ChatMapping, Conversation, DataSourceValue} from "@models/processed";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AnonymizationModal from "@components/AnonymizationModal";

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
                            <TableCell>{t('contacts-mapping.pseudonyms')}</TableCell>
                            <TableCell>{t('contacts-mapping.contacts')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(chatMappingToShow.entries()).map(([chatPseudonym, chatParticipants]) => (
                            <TableRow
                                key={chatPseudonym}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{chatPseudonym}</TableCell>
                                <TableCell>{chatParticipants.join(", ")}</TableCell>
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
