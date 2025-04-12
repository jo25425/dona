import React from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { BasicStatistics } from "@models/graphData";

const CARD_COLOR_PRIMARY = "#f5f5f5";
const CARD_COLOR_SECONDARY = "#e3f2fd";

export default function StatisticsCard({ stats }: { stats: BasicStatistics }) {
    const t = useTranslations("feedback.statisticsCard");
    console.log("StatisticsCard stats", stats);

    const renderStatBox = (value: number, label: string, caption: string, bgcolor: string) => (
        <Box sx={{ textAlign: "center", bgcolor, p: 2, borderRadius: 1 }}>
            <Typography variant="h6">{value}</Typography>
            <Typography variant="body2">{label.toUpperCase()}</Typography>
            <Typography variant="caption">{caption}</Typography>
        </Box>
    );

    const renderSection = (title: string, explanation: string, boxes: React.ReactNode[]) => (
        <Box
            sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                textAlign: "center",
                bgcolor: "background.paper",
            }}
        >
            <Typography variant="body2" fontWeight="fontWeightBold" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2">{explanation}</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {boxes.map((box, index) => (
                    <Grid key={index} size={{ xs: 6 }}>
                        {box}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    return (
        <Grid container spacing={2}>
            {/* Messages */}
            <Grid size={{ xs: 12, md: 6 }}>
                {renderSection(
                    t("total-messages"),
                    t("active-years-explanation_format", { years: stats.numberOfActiveYears }),
                    [
                        renderStatBox(
                            stats.sentMessagesTotal,
                            t("messages"), t("sent"),
                            CARD_COLOR_PRIMARY
                        ),
                        renderStatBox(
                            stats.receivedMessagesTotal,
                            t("messages"), t("received"),
                            CARD_COLOR_SECONDARY
                        ),
                    ]
                )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                {renderSection(
                    t("average-per-active-month"),
                    t("active-months-explanation_format", { months: stats.numberOfActiveMonths }),
                    [
                        renderStatBox(
                            stats.sentWordsPerActiveMonth,
                            t("messages"), t("sent"),
                            CARD_COLOR_PRIMARY
                        ),
                        renderStatBox(
                            stats.receivedWordsPerActiveMonth,
                            t("messages"), t("received"),
                            CARD_COLOR_SECONDARY
                        ),
                    ]
                )}
            </Grid>
        </Grid>
    );
}
