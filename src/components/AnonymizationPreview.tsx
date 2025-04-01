import React, {useEffect, useState} from "react";
import {ChatMapping, Conversation, DataSourceValue} from "@models/processed";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AnonymizationModal from "@components/AnonymizationModal";
import CheckIcon from '@mui/icons-material/Check';
import styled from "@mui/material/styles/styled";
import Checkbox from "@mui/material/Checkbox";
import {useAliasConfig} from "@services/parsing/shared/aliasConfig";
import {useRichTranslations} from "@/hooks/useRichTranslations";

const ResponsiveTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        '&.small-header': {
            fontSize: '0.75rem',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
        }
    },
}));

interface AnonymizationPreviewProps {
    dataSourceValue: DataSourceValue;
    anonymizedConversations: Conversation[];
    chatMappingToShow: ChatMapping;
    onSelectedChatsChange: (selectedChats: Set<string>) => void;
    onFeedbackChatsChange: (feedbackChats: Set<string>) => void;
}

const AnonymizationPreview: React.FC<AnonymizationPreviewProps> = (
    {dataSourceValue, anonymizedConversations, chatMappingToShow, onSelectedChatsChange, onFeedbackChatsChange}
) => {
    const donation = useRichTranslations("donation");
    const aliasConfig = useAliasConfig();
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [donationChats, setDonationChats] = useState<Set<string>>(new Set(chatMappingToShow.keys())); // Initialize selected
    const [feedbackChats, setFeedbackChats] = useState<Set<string>>(new Set()); // Initialize not selected

    // Use function from parent to feedback changes to selected chats
    useEffect(() => {
        onSelectedChatsChange(donationChats);
    }, [donationChats]);

    // Use function from parent to feedback changes to feedback chats
    useEffect(() => {
        onFeedbackChatsChange(feedbackChats);
    }, [feedbackChats]);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleCheckboxChange = (chatPseudonym: string) => {
        const newDonationChats = new Set(donationChats);
        if (newDonationChats.has(chatPseudonym)) {
            newDonationChats.delete(chatPseudonym);
            setFeedbackChats(prev => {
                const newFeedbackChats = new Set(prev);
                newFeedbackChats.delete(chatPseudonym);
                return newFeedbackChats;
            });
        } else {
            newDonationChats.add(chatPseudonym);
        }
        setDonationChats(newDonationChats);
    };

    const handleFeedbackCheckboxChange = (chatPseudonym: string) => {
        const newFeedbackChats = new Set(feedbackChats);
        if (newFeedbackChats.has(chatPseudonym)) {
            newFeedbackChats.delete(chatPseudonym);
        } else {
            newFeedbackChats.add(chatPseudonym);
        }
        setFeedbackChats(newFeedbackChats);
    };

    return (
        <Box sx={{ my: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                {donation.t("contacts-mapping.title")}
            </Typography>
            <Typography variant="body2" gutterBottom>
                {donation.t("contacts-mapping.subtitle", {"dataSourceInitials":  dataSourceValue.slice(0, 2).toWellFormed()})}
            </Typography>
            <Typography variant="body2">
                {donation.rich("chat-selection")}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small" aria-label="pseudonyms table">
                    <TableHead>
                        <TableRow sx={{ "th": { fontWeight: "bold" } }}>
                            <ResponsiveTableCell className="small-header">{donation.t("contacts-mapping.donate")}</ResponsiveTableCell>
                            <ResponsiveTableCell className="small-header">{donation.t("contacts-mapping.feedback")}</ResponsiveTableCell>
                            <ResponsiveTableCell>{donation.t('contacts-mapping.pseudonyms')}</ResponsiveTableCell>
                            <ResponsiveTableCell>{donation.t('contacts-mapping.contacts')}</ResponsiveTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(chatMappingToShow.entries()).map(([chatPseudonym, chatParticipants]) => (
                            <TableRow
                                key={chatPseudonym}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <ResponsiveTableCell padding="checkbox">
                                    {chatPseudonym != aliasConfig.donorAlias && (
                                        <Checkbox
                                            checked={donationChats.has(chatPseudonym)}
                                            onChange={() => handleCheckboxChange(chatPseudonym)}
                                        />
                                    )}
                                </ResponsiveTableCell>
                                <ResponsiveTableCell padding="checkbox">
                                    {chatPseudonym != aliasConfig.donorAlias && (
                                        <Checkbox
                                            checked={feedbackChats.has(chatPseudonym)}
                                            onChange={() => handleFeedbackCheckboxChange(chatPseudonym)}
                                            disabled={!donationChats.has(chatPseudonym)}
                                        />
                                    )}
                                </ResponsiveTableCell>
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
                <Button onClick={handleOpenModal}>{donation.t("preview-data.button")}</Button>
            </Box>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                {donation.t('successful')} {donation.t('preview-data.body2')}
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
