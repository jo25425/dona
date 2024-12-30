import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import ChartContainer from "@components/charts/ChartContainer";
import { GraphData } from "@models/graphData";
import { useTranslations } from "next-intl";

interface MoreChartsModalProps {
    open: boolean;
    onClose: () => void;
    graphData: GraphData;
    listOfConversations: string[];
    chartType: string;
}

const modalStyle = {
    position: "absolute" as const,
    top: "2%",
    bottom: "2%",
    left: "50%",
    width: "90%",
    maxWidth: "900px",
    transform: "translate(-50%, 0%)",
    overflow: "scroll",
    display: "block",
    bgcolor: "background.paper",
    border: "1px solid dimgrey",
    borderRadius: 2,
    boxShadow: 30,
    p: 4,
};

const MoreChartsModal: React.FC<MoreChartsModalProps> = ({
                                                             open,
                                                             onClose,
                                                             graphData,
                                                             listOfConversations,
                                                             chartType,
                                                         }) => {
    const t = useTranslations("feedback.responseTimes");
    const actions = useTranslations("actions");

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                    {t("moreAbout")}
                </Typography>
                <Typography variant="body1" mb={3}>
                    {t.rich("responseTimeBarChartMonthly.description",
                        {b: (content) => <b>{content}</b>})}
                </Typography>
                <Box mb={4}>
                    <ChartContainer
                        type={chartType}
                        data={graphData}
                        listOfConversations={listOfConversations}
                    />
                </Box>
                <Box display="flex" justifyContent="right">
                    <Button onClick={onClose} variant="contained">
                        {actions("close")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default MoreChartsModal;
