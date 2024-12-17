import React from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {BasicStatistics} from "@models/graphData";


export default function StatisticsCard({ stats }: { stats: BasicStatistics }) {
    const t = useTranslations("feedback.statisticsCard");

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 6}}>
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
                        {t("total-messages")}
                    </Typography>
                    <Typography variant="body2">
                        {t("active-years-explanation_format", { years: stats.numberOfActiveYears })}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{xs: 6}}>
                            <Box sx={{ textAlign: "center", bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                                <Typography variant="h6">{stats.sentMessagesTotal}</Typography>
                                <Typography variant="body2">{t("messages").toUpperCase()}</Typography>
                                <Typography variant="caption">{t("sent")}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <Box sx={{ textAlign: "center", bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
                                <Typography variant="h6">{stats.receivedMessagesTotal}</Typography>
                                <Typography variant="body2">{t("messages").toUpperCase()}</Typography>
                                <Typography variant="caption">{t("received")}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
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
                        {t("average-per-active-month")}
                    </Typography>
                    <Typography variant="body2">
                        {t("active-months-explanation_format", { months: stats.numberOfActiveMonths })}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{xs: 6}}>
                            <Box sx={{ textAlign: "center", bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                                <Typography variant="h6">{stats.sentPerActiveMonth}</Typography>
                                <Typography variant="body2">{t("messages").toUpperCase()}</Typography>
                                <Typography variant="caption">{t("sent")}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <Box sx={{ textAlign: "center", bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
                                <Typography variant="h6">{stats.receivedPerActiveMonth}</Typography>
                                <Typography variant="body2">{t("messages").toUpperCase()}</Typography>
                                <Typography variant="caption">{t("received")}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}
