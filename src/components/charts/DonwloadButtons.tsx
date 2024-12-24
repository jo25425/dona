import React from "react";
import { Box, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { toPng, toSvg } from "html-to-image";

interface DownloadButtonsProps {
    chartId: string;
    fileNamePrefix: string;
    currentLabel?: string;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
                                                                    chartId,
                                                                    fileNamePrefix,
                                                                    currentLabel,
                                                                }) => {
    const handleDownload = async (format: "png" | "svg") => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        try {
            const options = { backgroundColor: "#ffffff", padding: 20 };
            const dataUrl =
                format === "png" ? await toPng(chartElement, options) : await toSvg(chartElement, options);

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = currentLabel? `${fileNamePrefix}-${currentLabel}.${format}` : `${fileNamePrefix}.${format}`;
            link.click();
        } catch (error) {
            console.error("Error exporting chart:", error);
        }
    };

    return (
        <Box
            gap={1}
            sx={{ opacity: 0.25, transition: "opacity 0.3s", "&:hover": { opacity: 1 } }}
        >
            <IconButton
                onClick={() => handleDownload("png")}
                size="small"
                sx={{ position: "relative", "&:hover::after": { content: '"PNG"', position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "gray" } }}
            >
                <PhotoCameraIcon fontSize="small" />
            </IconButton>
            <IconButton
                onClick={() => handleDownload("svg")}
                size="small"
                sx={{ position: "relative", "&:hover::after": { content: '"SVG"', position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "gray" } }}
            >
                <PhotoCameraIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};
